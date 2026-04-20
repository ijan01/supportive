import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MH_ROLES, AU_LOCATIONS } from "@/constants";
import { getJobs, getJobCount } from "@/lib/jobs";
import JobCard from "@/components/JobCard";

export function generateStaticParams() {
  return MH_ROLES.map((r) => ({ "role-slug": r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "role-slug": string }>;
}): Promise<Metadata> {
  const p = await params;
  const role = MH_ROLES.find((r) => r.slug === p["role-slug"]);
  if (!role) return { title: "Not found" };

  let count = 0;
  try {
    count = await getJobCount({ category: role.name });
  } catch {
    // DB not available at build time
  }

  return {
    title: `${role.name} jobs in Australia`,
    description: `Browse ${count > 0 ? `${count} ` : ""}${role.name} roles across Australia. Find opportunities with mission-aligned mental health and community services employers on Supportive.`,
    alternates: { canonical: `/roles/${p["role-slug"]}` },
  };
}

export default async function RoleHubPage({
  params,
}: {
  params: Promise<{ "role-slug": string }>;
}) {
  const p = await params;
  const role = MH_ROLES.find((r) => r.slug === p["role-slug"]);
  if (!role) notFound();

  let jobs: Awaited<ReturnType<typeof getJobs>> = [];
  let total = 0;
  try {
    [jobs, total] = await Promise.all([
      getJobs({ category: role.name, limit: 6 }),
      getJobCount({ category: role.name }),
    ]);
  } catch {
    // DB not available at build time
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/roles" className="hover:text-violet-600 transition-colors">Roles</Link>
        <span className="mx-2">›</span>
        <span>{role.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">{role.name} jobs in Australia</h1>
      <p className="text-slate-500 mb-8">
        {total > 0
          ? `${total} current role${total !== 1 ? "s" : ""} available`
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
                href={`/jobs?category=${encodeURIComponent(role.name)}`}
                className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
              >
                View all {total} {role.name} roles &rarr;
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10 text-center">
          <p className="text-slate-600 font-medium mb-2">No {role.name} roles right now</p>
          <p className="text-slate-500 text-sm mb-4">New roles are added daily. Check back soon or browse all current roles.</p>
          <Link
            href="/jobs"
            className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
          >
            Browse all roles
          </Link>
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-800 mb-4">Browse by location</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {AU_LOCATIONS.filter((l) => l.state !== null).map((loc) => (
          <li key={loc.slug}>
            <Link
              href={`/roles/${p["role-slug"]}/${loc.slug}`}
              className="block px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-all"
            >
              {loc.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
