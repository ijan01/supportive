import { Metadata } from "next";
import Link from "next/link";
import { AU_SPECIALTIES } from "@/constants";

export const metadata: Metadata = {
  title: "Mental health specialisations — Australia",
  description: "Browse mental health jobs by specialisation — AOD, youth mental health, trauma, perinatal, LGBTQIA+, and more.",
  alternates: { canonical: "/specialties" },
};

export default function SpecialtiesIndexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Specialisations</h1>
      <p className="text-slate-500 mb-10">Browse roles by area of practice across {AU_SPECIALTIES.length} specialisations.</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AU_SPECIALTIES.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/specialties/${s.slug}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm transition-all"
            >
              <span className="font-medium text-slate-800">{s.name}</span>
              <span className="text-violet-500 text-sm">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
