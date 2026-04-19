import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { AU_LOCATIONS, MH_ROLES } from "@/constants";

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
  return {
    title: `Mental health jobs in ${loc.name}`,
    description: `Browse mental health and supportive services roles in ${loc.name}. Find clinical, allied health, community, and NDIS positions on Supportive.`,
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/locations" className="hover:text-violet-600 transition-colors">Locations</Link>
        <span className="mx-2">›</span>
        <span>{loc.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-4">Mental health jobs in {loc.name}</h1>

      <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-10">
        <p className="text-violet-700 font-medium mb-1">Coming soon — this hub is being built.</p>
        <p className="text-violet-600 text-sm">This page will list all mental health roles in {loc.name}, with employer profiles and local salary benchmarks.</p>
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-4">Browse roles in {loc.name}</h2>
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
