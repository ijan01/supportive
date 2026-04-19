import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MH_ROLES, AU_LOCATIONS } from "@/constants";

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
  return {
    title: `${role.name} jobs in Australia`,
    description: `Browse ${role.name} roles across Australia. Find opportunities with mission-aligned mental health and community services employers on Supportive.`,
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/roles" className="hover:text-violet-600 transition-colors">Roles</Link>
        <span className="mx-2">›</span>
        <span>{role.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-4">{role.name} jobs in Australia</h1>

      <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-10">
        <p className="text-violet-700 font-medium mb-1">Coming soon — this hub is being built.</p>
        <p className="text-violet-600 text-sm">This page will list all {role.name} roles across Australia, with editorial content about the role, salary benchmarks, and required qualifications.</p>
      </div>

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

      <div className="mt-8">
        <Link href="/jobs" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all">
          Browse all {role.name} roles →
        </Link>
      </div>
    </div>
  );
}
