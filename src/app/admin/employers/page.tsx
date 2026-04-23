import Link from "next/link";
import { getAllEmployersAdmin } from "@/lib/employers";
import { ORGANISATION_TYPES } from "@/constants";
import AdminEmployerActions from "./client";

export const dynamic = "force-dynamic";

export default async function AdminEmployersPage() {
  const employers = await getAllEmployersAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-sm mb-1">
        <Link href="/admin" className="text-violet-600 hover:text-violet-700 font-medium">Admin</Link>
        <span className="text-slate-300">&rsaquo;</span>
        <span className="text-slate-500">Employers</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Employers ({employers.length})</h1>
        <Link href="/admin/employers/import" className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700">
          Bulk import
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Organisation</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Active Jobs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Featured</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Until</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Stripe Sub</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employers.map((e) => {
                const orgType = ORGANISATION_TYPES.find((t) => t.value === e.organisation_type);
                return (
                  <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {e.logo_url ? (
                          <img src={e.logo_url} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">{e.name.charAt(0)}</div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900">{e.name}</div>
                          <div className="text-xs text-slate-400">/{e.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {orgType && orgType.value !== "other" ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${orgType.color}`}>{orgType.label}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">{e.active_job_count}</td>
                    <td className="px-4 py-3">
                      {e.featured ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Yes</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {e.featured_until ? new Date(e.featured_until).toLocaleDateString("en-AU") : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                      {e.stripe_subscription_id ? e.stripe_subscription_id.slice(0, 16) + "..." : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <AdminEmployerActions employerId={e.id} isFeatured={e.featured} />
                        <Link href={`/employers/${e.slug}`} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {employers.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No employers yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
