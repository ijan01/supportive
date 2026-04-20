import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MH_ROLES, AU_LOCATIONS } from "@/constants";
import { getJobs, getJobCount } from "@/lib/jobs";
import { ROLE_CONTENT } from "@/content/roles";
import JobCard from "@/components/JobCard";
import { formatSalary } from "@/lib/utils";

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

  const content = ROLE_CONTENT[p["role-slug"]];

  let count = 0;
  try {
    count = await getJobCount({ category: role.name });
  } catch {
    // DB not available at build time
  }

  return {
    title: `${role.name} jobs in Australia`,
    description: content?.summary ?? `Browse ${count > 0 ? `${count} ` : ""}${role.name} roles across Australia. Find opportunities with mission-aligned mental health and community services employers on Supportive.`,
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

  const content = ROLE_CONTENT[p["role-slug"]];

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
        <span className="mx-2">&rsaquo;</span>
        <span>{role.name}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">{role.name} jobs in Australia</h1>
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
                View all {total} {role.name} roles
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="bg-lavender border border-violet-100 rounded-2xl p-8 mb-10 text-center">
          <p className="text-slate-700 font-medium mb-2">No {role.name} roles right now</p>
          <p className="text-slate-500 text-sm mb-4">New roles are added daily. Check back soon or browse all current roles.</p>
          <Link
            href="/jobs"
            className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
          >
            Browse all roles
          </Link>
        </div>
      )}

      {content && (
        <div className="mt-12 space-y-8 border-t border-slate-100 pt-10">
          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">About {role.name} roles</h2>
            <div className="space-y-4">
              {content.about.map((para, i) => (
                <p key={i} className="text-slate-600 leading-relaxed">{para}</p>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="bg-lavender rounded-2xl p-6 border border-violet-100">
              <h2 className="text-base font-semibold text-slate-900 mb-3">Typical salary</h2>
              <p className="text-2xl font-extrabold text-violet-600 mb-1">
                {formatSalary(content.salaryMin, content.salaryMax)}
              </p>
              <p className="text-sm text-slate-500">{content.salaryNote}</p>
            </section>

            <section className="bg-lavender rounded-2xl p-6 border border-violet-100">
              <h2 className="text-base font-semibold text-slate-900 mb-3">Registration</h2>
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
            <h2 className="text-base font-semibold text-slate-900 mb-3">Career pathway</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{content.careerPathway}</p>
          </section>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Browse {role.name} jobs by location</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AU_LOCATIONS.filter((l) => l.state !== null).map((loc) => (
            <li key={loc.slug}>
              <Link
                href={`/roles/${p["role-slug"]}/${loc.slug}`}
                className="block px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 hover:border-violet-300 hover:text-violet-600 transition-all"
              >
                {loc.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex gap-3 text-sm">
        <Link href="/roles" className="text-violet-600 hover:text-violet-700 font-medium">
          All role types
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/jobs" className="text-violet-600 hover:text-violet-700 font-medium">
          Browse all roles
        </Link>
      </div>
    </div>
  );
}
