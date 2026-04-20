import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getJobsByStatus } from "@/lib/feed-jobs";
import ReviewQueueClient from "./client";

export const dynamic = "force-dynamic";

export default async function ReviewQueuePage() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") redirect("/auth/login");

  const jobs = await getJobsByStatus("review_queue");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Review queue</h1>
        <p className="text-slate-500 text-sm mt-1">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} awaiting classification review
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">No jobs in the review queue.</p>
        </div>
      ) : (
        <ReviewQueueClient jobs={jobs} />
      )}
    </div>
  );
}
