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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Mental health roles</h1>
      <p className="text-slate-500 mb-10">Browse all 18 role categories across clinical, allied health, community, and leadership.</p>

      <div className="space-y-10">
        {MH_ROLE_GROUPS.map((group) => (
          <div key={group.slug}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">{group.label}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MH_ROLES.filter((r) => r.group === group.slug).map((role) => (
                <li key={role.slug}>
                  <Link
                    href={`/roles/${role.slug}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm transition-all"
                  >
                    <span className="font-medium text-slate-800">{role.name}</span>
                    <span className="text-violet-500 text-sm">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
