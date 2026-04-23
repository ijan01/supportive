import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MH_ROLES, AU_LOCATIONS } from "@/constants";

import { getJobCountByRoleAndLocation, getJobsByRoleAndLocation } from "@/lib/jobs";
import { getRoleLocationContent } from "@/content/role-location";
import { formatSalary } from "@/lib/utils";
import JobCard from "@/components/JobCard";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/jsonld";

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

  const content = getRoleLocationContent(p["role-slug"], p["location-slug"]);

  let listingsCount = 0;
  try {
    listingsCount = await getJobCountByRoleAndLocation(role.name, loc.name);
  } catch {
    // DB not available at build time
  }

  const hasContent = !!content;
  const noindex = !hasContent && listingsCount < 3;

  return {
    title: `${role.name} jobs in ${loc.name}`,
    description: content
      ? `Find ${role.name} jobs in ${loc.name}. ${content.demandNote} Browse current listings on Supportive.`
      : `Browse ${role.name} roles in ${loc.name}. Find opportunities with mission-aligned mental health employers on Supportive.`,
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

  const content = getRoleLocationContent(p["role-slug"], p["location-slug"]);

  let jobs: Awaited<ReturnType<typeof getJobsByRoleAndLocation>> = [];
  try {
    jobs = await getJobsByRoleAndLocation(role.name, loc.name);
  } catch {
    // DB not available at build time
  }

  const description = content
    ? `Find ${role.name} jobs in ${loc.name}. ${content.demandNote} Browse current listings on Supportive.`
    : `Browse ${role.name} roles in ${loc.name}. Find opportunities with mission-aligned mental health employers on Supportive.`;
  const collectionSchema = buildCollectionPageSchema(
    `${role.name} jobs in ${loc.name}`,
    description,
    `/roles/${p["role-slug"]}/${p["location-slug"]}`
  );
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Roles", url: "/roles" },
    { name: role.name, url: `/roles/${p["role-slug"]}` },
    { name: loc.name },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Roles", href: "/roles" },
        { label: role.name, href: `/roles/${p["role-slug"]}` },
        { label: loc.name },
      ]} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">{role.name} jobs in {loc.name}</h1>
      <p className="text-slate-500 mb-8">
        {jobs.length > 0
          ? `${jobs.length} current role${jobs.length !== 1 ? "s" : ""} available`
          : "No current listings in this location"}
      </p>

      {/* Live job listings */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-lavender border border-violet-100 rounded-2xl p-8 mb-8 text-center">
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

      {/* Editorial content */}
      {content && (
        <div className="mt-10 space-y-8 border-t border-slate-100 pt-10">
          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">{role.name} work in {loc.name}</h2>
            <p className="text-slate-600 leading-relaxed mb-4">{content.intro}</p>
            <p className="text-slate-600 leading-relaxed mb-4">{content.roleContext}</p>
            <p className="text-slate-600 leading-relaxed">{content.locationContext}</p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="bg-lavender rounded-2xl p-6 border border-violet-100">
              <h2 className="text-base font-semibold text-slate-900 mb-2">Typical salary</h2>
              <p className="text-2xl font-extrabold text-violet-600 mb-1">
                {formatSalary(content.salaryMin, content.salaryMax)}
              </p>
              <p className="text-sm text-slate-500">{content.salaryNote}</p>
            </section>

            <section className="bg-lavender rounded-2xl p-6 border border-violet-100">
              <h2 className="text-base font-semibold text-slate-900 mb-2">Registration</h2>
              <p className="text-sm text-slate-600">{content.registration}</p>
            </section>
          </div>

          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Qualifications typically required</h2>
            <ul className="space-y-2">
              {content.qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-2" />
                  {q}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Key employers in {loc.name}</h2>
            <ul className="flex flex-wrap gap-2">
              {content.keyEmployers.map((employer) => (
                <li key={employer} className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-sm text-slate-600">
                  {employer}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <div className="mt-10 flex gap-3">
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
