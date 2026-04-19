import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MH_ROLES, AU_LOCATIONS } from "@/constants";

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
  return {
    title: `${role.name} jobs in ${loc.name}`,
    description: `Browse ${role.name} roles in ${loc.name}. Find opportunities with mission-aligned mental health employers on Supportive.`,
    alternates: { canonical: `/roles/${p["role-slug"]}/${p["location-slug"]}` },
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/roles" className="hover:text-violet-600 transition-colors">Roles</Link>
        <span className="mx-2">›</span>
        <Link href={`/roles/${p["role-slug"]}`} className="hover:text-violet-600 transition-colors">{role.name}</Link>
        <span className="mx-2">›</span>
        <span>{loc.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-4">{role.name} jobs in {loc.name}</h1>

      <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-8">
        <p className="text-violet-700 font-medium mb-1">Coming soon — this hub is being built.</p>
        <p className="text-violet-600 text-sm">This page will list {role.name} roles in {loc.name}, with salary benchmarks, local employer profiles, and registration requirements for {loc.state ?? "Australia"}.</p>
      </div>

      <div className="flex gap-3">
        <Link href={`/roles/${p["role-slug"]}`} className="text-violet-600 hover:text-violet-700 text-sm font-medium">
          ← All {role.name} roles
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/jobs" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
          Browse all roles →
        </Link>
      </div>
    </div>
  );
}
