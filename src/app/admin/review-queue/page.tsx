import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getJobsByStatus, countJobsByStatus } from "@/lib/feed-jobs";
import ReviewQueueClient from "./client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReviewQueuePage() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") redirect("/auth/login");

  const [jobs, totalCount] = await Promise.all([
    getJobsByStatus("review_queue"),
    countJobsByStatus("review_queue"),
  ]);

  const hasMore = totalCount > jobs.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Review queue</h1>
          <p className="text-slate-500 text-sm mt-1">
            {hasMore
              ? `Showing ${jobs.length} of ${totalCount} jobs awaiting review`
              : `${totalCount} job${totalCount !== 1 ? "s" : ""} awaiting review`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/feeds"
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Run ingestion
          </Link>
          <Link
            href="/admin/feed-runs"
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Feed history
          </Link>
        </div>
      </div>

      <ReviewQueueClient jobs={jobs} totalCount={totalCount} />
    </div>
  );
}
