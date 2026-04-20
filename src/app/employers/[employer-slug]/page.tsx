import { Metadata } from "next";
import Link from "next/link";
import { getJobs, getJobCount } from "@/lib/jobs";
import JobCard from "@/components/JobCard";

function formatEmployerName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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

export default async function EmployerHubPage({
  params,
}: {
  params: Promise<{ "employer-slug": string }>;
}) {
  const p = await params;
  const name = formatEmployerName(p["employer-slug"]);

  const [jobs, total] = await Promise.all([
    getJobs({ search: name, limit: 20 }),
    getJobCount({ search: name }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/employers" className="hover:text-violet-600 transition-colors">Employers</Link>
        <span className="mx-2">›</span>
        <span>{name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">{name}</h1>
      <p className="text-slate-500 mb-8">
        {total > 0
          ? `${total} current role${total !== 1 ? "s" : ""}`
          : "No current listings."}
      </p>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8 text-center">
          <p className="text-slate-600 font-medium mb-2">No open roles at {name} right now</p>
          <p className="text-slate-500 text-sm mb-4">New roles are added daily. Browse all current roles in the meantime.</p>
          <Link
            href="/jobs"
            className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
          >
            Browse all roles
          </Link>
        </div>
      )}

      <Link href="/jobs" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
        &larr; Browse all roles
      </Link>
    </div>
  );
}
