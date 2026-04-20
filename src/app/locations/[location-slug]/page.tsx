import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { AU_LOCATIONS, MH_ROLES } from "@/constants";
import { getJobs, getJobCount } from "@/lib/jobs";
import JobCard from "@/components/JobCard";

export function generateStaticParams() {
  return AU_LOCATIONS.map((l) => ({ "location-slug": l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "location-slug": string }>;
}): Promise<Metadata> {
  const p = await params;
  const loc = AU_LOCATIONS.find((l) => l.slug === p["location-slug"]);
  if (!loc) return { title: "Not found" };

  let count = 0;
  try {
    count = await getJobCount({ location: loc.name });
  } catch {
    // DB not available at build time
  }

  return {
    title: `Mental health jobs in ${loc.name}`,
    description: `Browse ${count > 0 ? `${count} ` : ""}mental health and supportive services roles in ${loc.name}. Find clinical, allied health, community, and NDIS positions on Supportive.`,
    alternates: { canonical: `/locations/${p["location-slug"]}` },
  };
}

export default async function LocationHubPage({
  params,
}: {
  params: Promise<{ "location-slug": string }>;
}) {
  const p = await params;
  const loc = AU_LOCATIONS.find((l) => l.slug === p["location-slug"]);
  if (!loc) notFound();

  let jobs: Awaited<ReturnType<typeof getJobs>> = [];
  let total = 0;
  try {
    [jobs, total] = await Promise.all([
      getJobs({ location: loc.name, limit: 6 }),
      getJobCount({ location: loc.name }),
    ]);
  } catch {
    // DB not available at build time
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/locations" className="hover:text-violet-600 transition-colors">Locations</Link>
        <span className="mx-2">›</span>
        <span>{loc.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Mental health jobs in {loc.name}</h1>
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
                href={`/jobs?location=${encodeURIComponent(loc.name)}`}
                className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
              >
                View all {total} roles in {loc.name} &rarr;
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10 text-center">
          <p className="text-slate-600 font-medium mb-2">No roles in {loc.name} right now</p>
          <p className="text-slate-500 text-sm mb-4">New roles are added daily. Check back soon or browse all current roles.</p>
          <Link
            href="/jobs"
            className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
          >
            Browse all roles
          </Link>
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-800 mb-4">Browse by role in {loc.name}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MH_ROLES.map((role) => (
          <li key={role.slug}>
            <Link
              href={`/roles/${role.slug}/${p["location-slug"]}`}
              className="block px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-all"
            >
              {role.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
