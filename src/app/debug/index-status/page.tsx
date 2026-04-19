import { notFound } from "next/navigation";
import { MH_ROLES, AU_LOCATIONS } from "@/constants";
import { shouldNoindex } from "@/lib/noindex";
import { getJobCountByRoleAndLocation } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export default async function IndexStatusPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const rows = await Promise.all(
    MH_ROLES.flatMap((role) =>
      AU_LOCATIONS.map(async (loc) => {
        let listingsCount = 0;
        try {
          listingsCount = await getJobCountByRoleAndLocation(role.name, loc.name);
        } catch {
          // DB unavailable
        }
        const noindex = shouldNoindex({
          listingsCount,
          historicalCount: 0,
          contentWordCount: 0,
          hasCustomMeta: false,
        });
        return { role: role.name, location: loc.name, listingsCount, noindex };
      })
    )
  );

  const indexable = rows.filter((r) => !r.noindex);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Index status — role × location pages</h1>
      <p className="text-slate-500 text-sm mb-6">
        Dev only. {indexable.length} of {rows.length} pages are indexable.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200">Role</th>
              <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200">Location</th>
              <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200 text-right">Listings</th>
              <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.role}-${r.location}`} className="border-b border-slate-100">
                <td className="px-3 py-1.5 border border-slate-200 text-slate-800">{r.role}</td>
                <td className="px-3 py-1.5 border border-slate-200 text-slate-600">{r.location}</td>
                <td className="px-3 py-1.5 border border-slate-200 text-right tabular-nums">{r.listingsCount}</td>
                <td className="px-3 py-1.5 border border-slate-200">
                  {r.noindex ? (
                    <span className="text-amber-600 font-medium">noindex</span>
                  ) : (
                    <span className="text-green-600 font-medium">index</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
