import { Metadata } from "next";
import Link from "next/link";

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-sm text-slate-400">
        <Link href="/employers" className="hover:text-violet-600 transition-colors">Employers</Link>
        <span className="mx-2">›</span>
        <span>{name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-4">{name}</h1>

      <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-8">
        <p className="text-violet-700 font-medium mb-1">Coming soon — this hub is being built.</p>
        <p className="text-violet-600 text-sm">This page will show open roles at {name}, along with an employer profile, mission statement, and culture notes.</p>
      </div>

      <Link href="/jobs" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
        ← Browse all roles
      </Link>
    </div>
  );
}
