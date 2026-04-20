import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { AU_SPECIALTIES } from "@/constants";
import { getJobs, getJobCount } from "@/lib/jobs";
import JobCard from "@/components/JobCard";

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
  return {
    title: `${specialty.name} jobs in Australia`,
    description: `Browse mental health and supportive services roles specialising in ${specialty.name} across Australia on Supportive.`,
    alternates: { canonical: `/specialties/${p["specialty-slug"]}` },
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/specialties" className="hover:text-violet-600 transition-colors">Specialisations</Link>
        <span className="mx-2">›</span>
        <span>{specialty.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">{specialty.name} jobs in Australia</h1>
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
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10 text-center">
          <p className="text-slate-600 font-medium mb-2">No {specialty.name} roles listed right now</p>
          <p className="text-slate-500 text-sm mb-4">New roles are added daily. Browse all current roles or try a broader search.</p>
          <Link
            href="/jobs"
            className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
          >
            Browse all roles
          </Link>
        </div>
      )}

      <div className="flex gap-3 text-sm">
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
