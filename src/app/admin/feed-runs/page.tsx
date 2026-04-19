import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getRecentFeedRuns } from "@/lib/feed-jobs";

export const dynamic = "force-dynamic";

export default async function FeedRunsPage() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "company") redirect("/auth/login");

  const runs = await getRecentFeedRuns();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Feed runs</h1>
        <p className="text-slate-500 text-sm mt-1">Last {runs.length} ingestion runs</p>
      </div>

      {runs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">No feed runs yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200">ID</th>
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200">Started</th>
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200">Duration</th>
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200">Status</th>
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200 text-right">Fetched</th>
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200 text-right">Deduped</th>
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200 text-right">Filtered</th>
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200 text-right">Published</th>
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200 text-right">Queued</th>
                <th className="px-3 py-2 font-medium text-slate-700 border border-slate-200 text-right">Rejected</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => {
                const started = new Date(run.started_at);
                const finished = run.finished_at ? new Date(run.finished_at) : null;
                const durationMs = finished ? finished.getTime() - started.getTime() : null;
                const durationStr = durationMs !== null ? `${(durationMs / 1000).toFixed(1)}s` : "...";
                const statusColor =
                  run.status === "completed" ? "text-green-600" :
                  run.status === "failed" ? "text-red-600" :
                  "text-amber-600";

                return (
                  <tr key={run.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 border border-slate-200 tabular-nums">{run.id}</td>
                    <td className="px-3 py-2 border border-slate-200 text-slate-600">
                      {started.toLocaleString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-3 py-2 border border-slate-200 tabular-nums">{durationStr}</td>
                    <td className={`px-3 py-2 border border-slate-200 font-medium ${statusColor}`}>{run.status}</td>
                    <td className="px-3 py-2 border border-slate-200 text-right tabular-nums">{run.total_fetched}</td>
                    <td className="px-3 py-2 border border-slate-200 text-right tabular-nums">{run.total_deduped}</td>
                    <td className="px-3 py-2 border border-slate-200 text-right tabular-nums">{run.total_filtered}</td>
                    <td className="px-3 py-2 border border-slate-200 text-right tabular-nums text-green-600">{run.total_published}</td>
                    <td className="px-3 py-2 border border-slate-200 text-right tabular-nums text-amber-600">{run.total_queued}</td>
                    <td className="px-3 py-2 border border-slate-200 text-right tabular-nums text-red-600">{run.total_rejected}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {runs.some((r) => r.error) && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Errors</h2>
          {runs.filter((r) => r.error).map((r) => (
            <div key={r.id} className="bg-red-50 border border-red-100 rounded-lg p-4 mb-3 text-sm text-red-700">
              <span className="font-medium">Run #{r.id}:</span> {r.error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
