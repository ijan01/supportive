import { Metadata } from "next";
import Link from "next/link";
import { MH_ROLES, MH_ROLE_GROUPS } from "@/constants";

export const metadata: Metadata = {
  title: "Mental health roles in Australia",
  description: "Browse all 18 mental health and supportive services role categories on Supportive — from Clinical Psychologist to Peer Support Worker.",
  alternates: { canonical: "/roles" },
};

export default function RolesIndexPage() {
  return (
    <>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Mental health <span className="text-highlight">roles</span>
          </h1>
          <p className="text-slate-500 text-lg">Browse all 18 role categories across clinical, allied health, community, and leadership.</p>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {MH_ROLE_GROUPS.map((group) => (
            <div key={group.slug}>
              <h2 className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-4">{group.label}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MH_ROLES.filter((r) => r.group === group.slug).map((role) => (
                  <li key={role.slug}>
                    <Link
                      href={`/roles/${role.slug}`}
                      className="flex items-center justify-between px-5 py-4 rounded-2xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-md transition-all"
                    >
                      <span className="font-medium text-slate-800">{role.name}</span>
                      <span className="text-violet-500 text-sm font-medium">View</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
