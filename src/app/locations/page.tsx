import { Metadata } from "next";
import Link from "next/link";
import { AU_LOCATIONS, AU_STATES } from "@/constants";

export const metadata: Metadata = {
  title: "Mental health jobs by location — Australia",
  description: "Browse mental health and supportive services roles by city and state across Australia.",
  alternates: { canonical: "/locations" },
};

export default function LocationsIndexPage() {
  const cities = AU_LOCATIONS.filter((l) => l.state !== null);
  const other = AU_LOCATIONS.filter((l) => l.state === null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Jobs by location</h1>
      <p className="text-slate-500 mb-10">Find mental health and supportive services roles in your city or state.</p>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Cities</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {cities.map((loc) => (
          <li key={loc.slug}>
            <Link
              href={`/locations/${loc.slug}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm transition-all"
            >
              <span className="font-medium text-slate-800">{loc.name}</span>
              <span className="text-xs text-slate-400">{loc.state}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Work arrangement</h2>
      <ul className="grid grid-cols-2 gap-3">
        {other.map((loc) => (
          <li key={loc.slug}>
            <Link
              href={`/locations/${loc.slug}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm transition-all"
            >
              <span className="font-medium text-slate-800">{loc.name}</span>
              <span className="text-violet-500 text-sm">→</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-400 mt-8">Covering all {AU_STATES.length} states and territories.</p>
    </div>
  );
}
