import Link from "next/link";
import { getAllJobsAdmin } from "@/lib/admin";
import AdminJobActions from "./client";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  review_queue: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-slate-100 text-slate-600",
};

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const { jobs, total } = await getAllJobsAdmin({
    status: params.status,
    source: params.source,
    search: params.search,
    page,
    limit: 50,
  });
  const totalPages = Math.ceil(total / 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="text-sm text-violet-600 hover:text-violet-700 font-medium">Admin</Link>
          <h1 className="text-2xl font-extrabold text-slate-900">All jobs ({total})</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "All", value: "" },
          { label: "Active", value: "active" },
          { label: "Review queue", value: "review_queue" },
          { label: "Rejected", value: "rejected" },
        ].map((f) => (
          <Link
            key={f.value}
            href={`/admin/jobs${f.value ? `?status=${f.value}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              (params.status || "") === f.value
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"
            }`}
          >
            {f.label}
          </Link>
        ))}
        <Link
          href={`/admin/jobs?source=adzuna`}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            params.source === "adzuna"
              ? "bg-violet-600 text-white border-violet-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"
          }`}
        >
          Adzuna only
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Location</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(jobs as Array<Record<string, unknown>>).map((job) => (
                <tr key={job.id as number} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                    <Link href={`/jobs/${job.id}`} className="hover:text-violet-600">{job.title as string}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate">{job.company as string}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[job.status as string] || "bg-slate-100 text-slate-600"}`}>
                      {job.status as string}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{job.source as string}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">{job.category as string}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">{job.location as string}</td>
                  <td className="px-4 py-3">
                    <AdminJobActions jobId={job.id as number} status={job.status as string} />
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No jobs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/admin/jobs?page=${page - 1}${params.status ? `&status=${params.status}` : ""}${params.source ? `&source=${params.source}` : ""}`} className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium hover:bg-slate-50">
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/admin/jobs?page=${page + 1}${params.status ? `&status=${params.status}` : ""}${params.source ? `&source=${params.source}` : ""}`} className="px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-medium hover:bg-violet-700">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
