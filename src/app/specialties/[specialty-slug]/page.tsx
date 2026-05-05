import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { AU_SPECIALTIES } from "@/constants";
import { getJobs, getJobCount } from "@/lib/jobs";
import { SPECIALTY_CONTENT } from "@/content/specialties";
import JobCard from "@/components/JobCard";
import EmptyJobsState from "@/components/EmptyJobsState";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { buildCollectionPageSchema, buildBreadcrumbSchema } from "@/lib/jsonld";

export function generateStaticParams() {
  return AU_SPECIALTIES.map((s) => ({ "specialty-slug": s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "specialty-slug": string }>;
}): Promise<Metadata> {
  const p = await params;
  const specialty = AU_SPECIALTIES.find((s) => s.slug === p["specialty-slug"]);
  if (!specialty) return { title: "Not found" };

  const content = SPECIALTY_CONTENT[p["specialty-slug"]];

  const title = `${specialty.name} jobs in Australia`;
  const description = content
    ? `${content.summary} Browse current ${specialty.name} roles on Supportive.`
    : `Browse mental health and supportive services roles specialising in ${specialty.name} across Australia on Supportive.`;

  return {
    title,
    description,
    alternates: { canonical: `/specialties/${p["specialty-slug"]}` },
    openGraph: { title, description },
    twitter: { card: "summary_large_image" as const, title, description },
  };
}

export default async function SpecialtyHubPage({
  params,
}: {
  params: Promise<{ "specialty-slug": string }>;
}) {
  const p = await params;
  const specialty = AU_SPECIALTIES.find((s) => s.slug === p["specialty-slug"]);
  if (!specialty) notFound();

  const content = SPECIALTY_CONTENT[p["specialty-slug"]];

  let jobs: Awaited<ReturnType<typeof getJobs>> = [];
  let total = 0;
  try {
    [jobs, total] = await Promise.all([
      getJobs({ search: specialty.name, limit: 6 }),
      getJobCount({ search: specialty.name }),
    ]);
  } catch {
    // DB not available at build time
  }

  const collectionSchema = buildCollectionPageSchema(
    `${specialty.name} jobs in Australia`,
    content?.summary || `Browse ${specialty.name} roles across Australia on Supportive.`,
    `/specialties/${p["specialty-slug"]}`
  );
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Specialisations", url: "/specialties" },
    { name: specialty.name },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Specialisations", href: "/specialties" },
        { label: specialty.name },
      ]} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">{specialty.name} jobs in Australia</h1>
      {content && (
        <p className="text-slate-600 text-lg leading-relaxed mb-6">{content.summary}</p>
      )}
      <p className="text-slate-500 mb-8">
        {total > 0
          ? `${total} current role${total !== 1 ? "s" : ""} matching this specialisation`
          : "No current listings — check back soon."}
      </p>

      {jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          {total > 6 && (
            <div className="mb-10">
              <Link
                href={`/jobs?search=${encodeURIComponent(specialty.name)}`}
                className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
              >
                View all {total} roles &rarr;
              </Link>
            </div>
          )}
        </>
      ) : (
        <EmptyJobsState label={`No ${specialty.name} roles listed right now`} />
      )}

      {content && (
        <div className="mt-10 space-y-8 border-t border-slate-100 pt-10">
          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">About {specialty.name}</h2>
            {content.about.map((para, i) => (
              <p key={i} className="text-slate-600 leading-relaxed mb-4">{para}</p>
            ))}
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="bg-lavender rounded-2xl p-6 border border-violet-100">
              <h2 className="text-base font-semibold text-slate-900 mb-3">Relevant roles</h2>
              <ul className="flex flex-wrap gap-2">
                {content.relevantRoles.map((role) => (
                  <li key={role} className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-sm text-slate-600">
                    {role}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-lavender rounded-2xl p-6 border border-violet-100">
              <h2 className="text-base font-semibold text-slate-900 mb-3">Key organisations</h2>
              <ul className="flex flex-wrap gap-2">
                {content.keyOrganisations.map((org) => (
                  <li key={org} className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-sm text-slate-600">
                    {org}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="bg-violet-600 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-2">Workforce demand</h2>
            <p className="text-violet-100 text-sm leading-relaxed">{content.demandNote}</p>
          </section>
        </div>
      )}

      <div className="mt-10 flex gap-3 text-sm">
        <Link href="/specialties" className="text-violet-600 hover:text-violet-700 font-medium">
          &larr; All specialisations
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/jobs" className="text-violet-600 hover:text-violet-700 font-medium">
          Browse all roles &rarr;
        </Link>
      </div>
    </div>
  );
}
