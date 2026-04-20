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
    <>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            <span className="text-highlight">Specialisations</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
            Mental health practice spans a wide range of specialisations, each with its own evidence base, workforce, and career pathways. Browse roles by area of practice to find positions that match your expertise and interests.
          </p>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AU_SPECIALTIES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/specialties/${s.slug}`}
                  className="flex items-center justify-between px-5 py-4 rounded-2xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-md transition-all"
                >
                  <span className="font-medium text-slate-800">{s.name}</span>
                  <span className="text-violet-500 text-sm font-medium">View</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
