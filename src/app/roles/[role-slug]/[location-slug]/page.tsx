import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MH_ROLES, AU_LOCATIONS } from "@/constants";
import { shouldNoindex } from "@/lib/noindex";
import { getJobCountByRoleAndLocation, getJobsByRoleAndLocation } from "@/lib/jobs";
import JobCard from "@/components/JobCard";

export function generateStaticParams() {
  return MH_ROLES.flatMap((role) =>
    AU_LOCATIONS.map((loc) => ({
      "role-slug": role.slug,
      "location-slug": loc.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "role-slug": string; "location-slug": string }>;
}): Promise<Metadata> {
  const p = await params;
  const role = MH_ROLES.find((r) => r.slug === p["role-slug"]);
  const loc = AU_LOCATIONS.find((l) => l.slug === p["location-slug"]);
  if (!role || !loc) return { title: "Not found" };

  let listingsCount = 0;
  try {
    listingsCount = await getJobCountByRoleAndLocation(role.name, loc.name);
  } catch {
    // DB not available at build time
  }

  const noindex = shouldNoindex({
    listingsCount,
    historicalCount: 0,
    contentWordCount: 0,
    hasCustomMeta: false,
  });

  return {
    title: `${role.name} jobs in ${loc.name}`,
    description: `Browse ${role.name} roles in ${loc.name}. Find opportunities with mission-aligned mental health employers on Supportive.`,
    alternates: { canonical: `/roles/${p["role-slug"]}/${p["location-slug"]}` },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

export default async function RoleLocationPage({
  params,
}: {
  params: Promise<{ "role-slug": string; "location-slug": string }>;
}) {
  const p = await params;
  const role = MH_ROLES.find((r) => r.slug === p["role-slug"]);
  const loc = AU_LOCATIONS.find((l) => l.slug === p["location-slug"]);
  if (!role || !loc) notFound();

  let jobs: Awaited<ReturnType<typeof getJobsByRoleAndLocation>> = [];
  try {
    jobs = await getJobsByRoleAndLocation(role.name, loc.name);
  } catch {
    // DB not available at build time
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/roles" className="hover:text-violet-600 transition-colors">Roles</Link>
        <span className="mx-2">&rsaquo;</span>
        <Link href={`/roles/${p["role-slug"]}`} className="hover:text-violet-600 transition-colors">{role.name}</Link>
        <span className="mx-2">&rsaquo;</span>
        <span>{loc.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">{role.name} jobs in {loc.name}</h1>
      <p className="text-slate-500 mb-8">
        {jobs.length > 0
          ? `${jobs.length} current role${jobs.length !== 1 ? "s" : ""} available`
          : "No current listings in this location"}
      </p>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8 text-center">
          <p className="text-slate-600 font-medium mb-2">No {role.name} roles in {loc.name} right now</p>
          <p className="text-slate-500 text-sm mb-4">New roles are added daily. Check back soon or browse all current roles.</p>
          <Link
            href={`/jobs?category=${encodeURIComponent(role.name)}`}
            className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
          >
            View all {role.name} roles
          </Link>
        </div>
      )}

      <div className="flex gap-3">
        <Link href={`/roles/${p["role-slug"]}`} className="text-violet-600 hover:text-violet-700 text-sm font-medium">
          &larr; All {role.name} roles
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/jobs" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
          Browse all roles &rarr;
        </Link>
      </div>
    </div>
  );
}
