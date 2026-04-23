import { sql, ensureInitialized } from "@/lib/db";
import { searchAdzunaAllPages, AdzunaJob, AdzunaSearchParams } from "./adzuna";
import { classifyJob, classifyJobStatus, isEligible } from "./classifier";
import { parseAdzunaLocation } from "./location-parser";
import { MH_ROLES } from "@/constants";

export interface IngestStats {
  totalFetched: number;
  totalDeduped: number;
  totalFiltered: number;
  totalClassified: number;
  totalPublished: number;
  totalQueued: number;
  totalRejected: number;
  errors: string[];
}

export interface IngestOptions {
  dryRun?: boolean;
  queries: AdzunaSearchParams[];
  maxPages?: number;
}

interface PreparedJob {
  job: AdzunaJob;
  classification: { roleSlug: string; confidence: number };
  parsedLocation: ReturnType<typeof parseAdzunaLocation>;
  status: "active" | "review_queue" | "rejected";
}

const BATCH_SIZE = 20;

function mapEmploymentType(
  contractTime: string | null,
  contractType: string | null
): string {
  if (contractTime === "part_time") return "part_time";
  if (contractType === "contract") return "contract";
  if (contractTime === "full_time") return "full_time";
  return "full_time";
}

function mapJobTypeDisplay(employmentType: string): string {
  const map: Record<string, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    casual: "Contract",
    internship: "Internship",
    volunteer: "Full-time",
  };
  return map[employmentType] ?? "Full-time";
}

function passesQualityGates(
  job: AdzunaJob,
  classification: { roleSlug: string; confidence: number } | null,
  locationResolved: boolean
): { passes: boolean; status: "active" | "review_queue" | "rejected" } {
  if (!classification) return { passes: false, status: "rejected" };

  const statusFromConfidence = classifyJobStatus(classification.confidence);
  const hasEmployer = !!job.company?.display_name?.trim();
  const hasValidUrl = !!job.redirect_url?.startsWith("http");
  const hasDescription = (job.description?.length ?? 0) >= 50;
  const postedDate = new Date(job.created);
  const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);
  const isRecent = postedDate >= fortyFiveDaysAgo;

  if (!hasValidUrl || !hasDescription || !isRecent) {
    return { passes: false, status: "rejected" };
  }

  if (!hasEmployer || !locationResolved) {
    return { passes: false, status: "review_queue" };
  }

  return { passes: statusFromConfidence === "active", status: statusFromConfidence };
}

async function getExistingExternalIds(): Promise<Set<string>> {
  await ensureInitialized();
  const result = await sql`
    SELECT external_id FROM jobs WHERE source = 'adzuna' AND external_id IS NOT NULL
  `;
  return new Set(result.rows.map((r) => r.external_id as string));
}

async function insertFeedJob(prepared: PreparedJob): Promise<void> {
  const { job, classification, parsedLocation, status } = prepared;
  const employmentType = mapEmploymentType(job.contract_time, job.contract_type);
  const jobTypeDisplay = mapJobTypeDisplay(employmentType);
  const role = MH_ROLES.find((r) => r.slug === classification.roleSlug);
  const categoryDisplay = role?.name ?? classification.roleSlug;
  const postedDate = new Date(job.created);
  const validThrough = new Date(postedDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO jobs (
      title, company, location, category, job_type, salary_min, salary_max,
      description, requirements, apply_url, is_featured,
      external_id, source, role_slug, role_confidence,
      employer_name, location_city, location_state,
      is_remote, employment_type, salary_is_predicted,
      posted_date, valid_through, status, raw_payload
    ) VALUES (
      ${job.title},
      ${job.company.display_name},
      ${parsedLocation.displayName},
      ${categoryDisplay},
      ${jobTypeDisplay},
      ${job.salary_min ?? null},
      ${job.salary_max ?? null},
      ${job.description},
      ${null},
      ${job.redirect_url},
      ${0},
      ${"adzuna:" + job.id},
      ${"adzuna"},
      ${classification.roleSlug},
      ${classification.confidence},
      ${job.company.display_name},
      ${parsedLocation.city},
      ${parsedLocation.state},
      ${parsedLocation.isRemote},
      ${employmentType},
      ${job.salary_is_predicted === "1"},
      ${postedDate.toISOString()},
      ${validThrough.toISOString()},
      ${status},
      ${JSON.stringify(job)}
    )
  `;
}

async function insertBatch(batch: PreparedJob[]): Promise<number> {
  let failed = 0;
  await Promise.all(
    batch.map((p) =>
      insertFeedJob(p).catch((err) => {
        console.error(`[ingest] insert failed for "${p.job.title}": ${err}`);
        failed++;
      })
    )
  );
  return failed;
}

async function createFeedRun(): Promise<number> {
  await ensureInitialized();
  const result = await sql`
    INSERT INTO feed_runs (status) VALUES ('running') RETURNING id
  `;
  return result.rows[0].id as number;
}

async function completeFeedRun(
  runId: number,
  stats: IngestStats,
  error?: string
): Promise<void> {
  await sql`
    UPDATE feed_runs SET
      finished_at = NOW(),
      status = ${error ? "failed" : "completed"},
      total_fetched = ${stats.totalFetched},
      total_deduped = ${stats.totalDeduped},
      total_filtered = ${stats.totalFiltered},
      total_classified = ${stats.totalClassified},
      total_published = ${stats.totalPublished},
      total_queued = ${stats.totalQueued},
      total_rejected = ${stats.totalRejected},
      error = ${error ?? null}
    WHERE id = ${runId}
  `;
}

export async function ingestAdzuna(options: IngestOptions): Promise<IngestStats> {
  const stats: IngestStats = {
    totalFetched: 0,
    totalDeduped: 0,
    totalFiltered: 0,
    totalClassified: 0,
    totalPublished: 0,
    totalQueued: 0,
    totalRejected: 0,
    errors: [],
  };

  let runId: number | null = null;
  if (!options.dryRun) {
    runId = await createFeedRun();
  }

  try {
    const existingIds = options.dryRun ? new Set<string>() : await getExistingExternalIds();
    const pendingInserts: PreparedJob[] = [];

    for (const query of options.queries) {
      let allJobs: AdzunaJob[];
      try {
        const result = await searchAdzunaAllPages(query, options.maxPages ?? 5);
        allJobs = result.jobs;
        console.log(`[ingest] query "${query.what}": ${allJobs.length} jobs across ${result.pagesUsed} pages (${result.totalAvailable} total available)`);
      } catch (err) {
        const msg = `Query "${query.what}" failed: ${err instanceof Error ? err.message : String(err)}`;
        console.error(`[ingest] ${msg}`);
        stats.errors.push(msg);
        continue;
      }

      for (const job of allJobs) {
        stats.totalFetched++;

        const externalId = "adzuna:" + job.id;
        if (existingIds.has(externalId)) {
          stats.totalDeduped++;
          continue;
        }

        if (!isEligible(job.title, job.description)) {
          stats.totalFiltered++;
          continue;
        }

        const classification = classifyJob(job.title, job.description);
        stats.totalClassified++;

        const parsedLocation = parseAdzunaLocation(
          job.location.area,
          job.location.display_name
        );
        const locationResolved = !!(parsedLocation.state || parsedLocation.isRemote);

        const { status } = passesQualityGates(job, classification, locationResolved);

        if (status === "active") stats.totalPublished++;
        else if (status === "review_queue") stats.totalQueued++;
        else stats.totalRejected++;

        if (!options.dryRun && classification) {
          existingIds.add(externalId);
          pendingInserts.push({ job, classification, parsedLocation, status });

          if (pendingInserts.length >= BATCH_SIZE) {
            const batch = pendingInserts.splice(0, BATCH_SIZE);
            const failed = await insertBatch(batch);
            if (failed > 0) stats.errors.push(`${failed} insert(s) failed in batch`);
          }
        }

        if (options.dryRun) {
          console.log(
            `[ingest:dry] "${job.title}" @ ${job.company.display_name} → ${classification?.roleSlug ?? "none"} (${classification?.confidence ?? 0}) → ${status}`
          );
        }
      }
    }

    if (pendingInserts.length > 0) {
      const failed = await insertBatch(pendingInserts);
      if (failed > 0) stats.errors.push(`${failed} insert(s) failed in final batch`);
    }

    if (runId) await completeFeedRun(runId, stats);
  } catch (err) {
    if (runId) await completeFeedRun(runId, stats, String(err));
    throw err;
  }

  console.log("[ingest] complete:", stats);
  return stats;
}
