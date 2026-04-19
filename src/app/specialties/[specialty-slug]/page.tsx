import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { AU_SPECIALTIES } from "@/constants";

export function generateStaticParams() {
  return AU_SPECIALTIES.map((s) => ({ "specialty-slug": s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "specialty-slug": string }>;
}): Promise<Metadata> {
  const p = await params;
  const specialty = AU_SPECIALTIES.find((s) => s.slug === p["specialty-slug"]);
  if (!specialty) return { title: "Not found" };
  return {
    title: `${specialty.name} jobs in Australia`,
    description: `Browse mental health and supportive services roles specialising in ${specialty.name} across Australia on Supportive.`,
    alternates: { canonical: `/specialties/${p["specialty-slug"]}` },
  };
}

export default async function SpecialtyHubPage({
  params,
}: {
  params: Promise<{ "specialty-slug": string }>;
}) {
  const p = await params;
  const specialty = AU_SPECIALTIES.find((s) => s.slug === p["specialty-slug"]);
  if (!specialty) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/specialties" className="hover:text-violet-600 transition-colors">Specialisations</Link>
        <span className="mx-2">›</span>
        <span>{specialty.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-4">{specialty.name} jobs in Australia</h1>

      <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-8">
        <p className="text-violet-700 font-medium mb-1">Coming soon — this hub is being built.</p>
        <p className="text-violet-600 text-sm">This page will feature roles, employers, and resources specialising in {specialty.name} across Australia.</p>
      </div>

      <div className="flex gap-3">
        <Link href="/specialties" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
          ← All specialisations
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/jobs" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
          Browse all roles →
        </Link>
      </div>
    </div>
  );
}
