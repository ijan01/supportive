import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getJobsByUserId } from "@/lib/jobs";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EmployerAnalyticsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "company") redirect("/dashboard/seeker");

  const userId = Number(session.user.id);
  const jobs = await getJobsByUserId(userId);

  const appCount = await sql`
    SELECT COUNT(*)::integer AS count FROM applications a
    JOIN jobs j ON j.id = a.job_id WHERE j.user_id = ${userId}
  `;

  const totalViews = jobs.reduce((s, j) => s + (j.view_count || 0), 0);
  const totalClicks = jobs.reduce((s, j) => s + (j.apply_click_count || 0), 0);
  const activeCount = jobs.filter((j) => j.status === "active").length;
  const totalApps = appCount.rows[0]?.count as number ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm mb-1">
        <Link href="/dashboard/company" className="text-violet-600 hover:text-violet-700 font-medium">Dashboard</Link>
        <span className="text-slate-300">&rsaquo;</span>
        <span className="text-slate-500">Analytics</span>
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-violet-600">{totalViews}</div>
          <div className="text-slate-500 text-xs font-medium">Total Views</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-emerald-600">{totalClicks}</div>
          <div className="text-slate-500 text-xs font-medium">Apply Clicks</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-blue-600">{activeCount}</div>
          <div className="text-slate-500 text-xs font-medium">Active Listings</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-amber-600">{totalApps}</div>
          <div className="text-slate-500 text-xs font-medium">Applications</div>
        </div>
      </div>

      {/* View bar chart */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Views per listing</h2>
          <div className="space-y-3">
            {jobs
              .filter((j) => j.status === "active")
              .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
              .map((job) => {
                const maxViews = Math.max(...jobs.map((j) => j.view_count || 0), 1);
                const pct = Math.round(((job.view_count || 0) / maxViews) * 100);
                return (
                  <div key={job.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <Link href={`/jobs/${job.id}`} className="text-slate-700 font-medium hover:text-violet-600 truncate max-w-[70%]">{job.title}</Link>
                      <span className="text-slate-500">{job.view_count || 0} views</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Listings table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 p-6 pb-3">All listings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Views</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Clicks</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Rate</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Apps</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const rate = (job.view_count || 0) > 0 ? ((job.apply_click_count || 0) / (job.view_count || 1) * 100).toFixed(1) : "—";
                return (
                  <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/jobs/${job.id}`} className="font-medium text-slate-900 hover:text-violet-600">{job.title}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">{job.view_count || 0}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{job.apply_click_count || 0}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{rate}{rate !== "—" ? "%" : ""}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{job.application_count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
