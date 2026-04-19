import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { getSavedJobs } from "@/lib/saved-jobs";
import { getApplicationsByUserId } from "@/lib/applications";
import JobCard from "@/components/JobCard";
import { formatRelativeDate } from "@/lib/utils";
import { APPLICATION_STATUS_COLORS } from "@/constants";

export default async function SeekerDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "seeker") redirect("/dashboard/company");

  const savedJobs = await getSavedJobs(Number(session.user.id));
  const applications = await getApplicationsByUserId(Number(session.user.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {session.user.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="text-3xl font-bold text-violet-600">{savedJobs.length}</div>
          <div className="text-slate-500 text-sm font-medium">Saved Jobs</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="text-3xl font-bold text-emerald-600">{applications.length}</div>
          <div className="text-slate-500 text-sm font-medium">Applications</div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Applications</h2>
          <Link href="/dashboard/seeker/applications" className="text-violet-600 font-medium hover:text-violet-700 text-sm">
            View all &rarr;
          </Link>
        </div>
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-slate-500 mb-4">You haven&apos;t applied to any jobs yet.</p>
            <Link href="/jobs" className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => {
              const statusColor = APPLICATION_STATUS_COLORS[app.status] || "bg-slate-100 text-slate-700";
              return (
                <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{app.job_title}</div>
                    <div className="text-sm text-slate-500">{app.job_company} &middot; Applied {formatRelativeDate(app.created_at)}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor}`}>{app.status}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Saved Jobs */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Saved Jobs</h2>
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <div className="text-4xl mb-3">🔖</div>
            <p className="text-slate-500 mb-4">You haven&apos;t saved any jobs yet.</p>
            <Link href="/jobs" className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  );
}
