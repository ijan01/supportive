import { Metadata } from "next";
import Link from "next/link";
import { getJobs, getJobCount } from "@/lib/jobs";
import JobCard from "@/components/JobCard";
import { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatEmployerName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getUniqueValues(jobs: Job[], key: keyof Job): string[] {
  return [...new Set(jobs.map((j) => String(j[key])).filter(Boolean))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "employer-slug": string }>;
}): Promise<Metadata> {
  const p = await params;
  const name = formatEmployerName(p["employer-slug"]);
  return {
    title: `${name} — mental health jobs`,
    description: `Browse open mental health and supportive services roles at ${name} on Supportive.`,
    alternates: { canonical: `/employers/${p["employer-slug"]}` },
  };
}

export default async function EmployerProfilePage({
  params,
}: {
  params: Promise<{ "employer-slug": string }>;
}) {
  const p = await params;
  const name = formatEmployerName(p["employer-slug"]);

  const [jobs, total] = await Promise.all([
    getJobs({ search: name, limit: 50 }),
    getJobCount({ search: name }),
  ]);

  const locations = getUniqueValues(jobs, "location");
  const categories = getUniqueValues(jobs, "category");
  const jobTypes = getUniqueValues(jobs, "job_type");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/employers" className="hover:text-violet-600 transition-colors">Employers</Link>
        <span className="mx-2">&rsaquo;</span>
        <span>{name}</span>
      </div>

      {/* Employer header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-2xl shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{name}</h1>
          <p className="text-slate-500 mt-1">
            {total > 0
              ? `${total} open role${total !== 1 ? "s" : ""} on Supportive`
              : "No current listings on Supportive"}
          </p>
        </div>
      </div>

      {/* Quick info cards */}
      {jobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {locations.length > 0 && (
            <div className="bg-lavender rounded-2xl p-5 border border-violet-100">
              <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">Locations</div>
              <div className="flex flex-wrap gap-1.5">
                {locations.map((loc) => (
                  <span key={loc} className="px-2.5 py-1 rounded-full bg-white text-xs text-slate-600 border border-violet-100">{loc}</span>
                ))}
              </div>
            </div>
          )}
          {categories.length > 0 && (
            <div className="bg-lavender rounded-2xl p-5 border border-violet-100">
              <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">Role types</div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <span key={cat} className="px-2.5 py-1 rounded-full bg-white text-xs text-slate-600 border border-violet-100">{cat}</span>
                ))}
              </div>
            </div>
          )}
          {jobTypes.length > 0 && (
            <div className="bg-lavender rounded-2xl p-5 border border-violet-100">
              <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">Employment</div>
              <div className="flex flex-wrap gap-1.5">
                {jobTypes.map((jt) => (
                  <span key={jt} className="px-2.5 py-1 rounded-full bg-white text-xs text-slate-600 border border-violet-100">{jt}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Open roles */}
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        {jobs.length > 0 ? `Open roles at ${name}` : "No open roles"}
      </h2>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-lavender border border-violet-100 rounded-2xl p-8 mb-8 text-center">
          <p className="text-slate-700 font-medium mb-2">No open roles at {name} right now</p>
          <p className="text-slate-500 text-sm mb-4">New roles are added daily. Browse all current roles in the meantime.</p>
          <Link
            href="/jobs"
            className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
          >
            Browse all roles
          </Link>
        </div>
      )}

      <div className="flex gap-3 text-sm">
        <Link href="/employers" className="text-violet-600 hover:text-violet-700 font-medium">
          All employers
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/jobs" className="text-violet-600 hover:text-violet-700 font-medium">
          Browse all roles
        </Link>
      </div>
    </div>
  );
}
