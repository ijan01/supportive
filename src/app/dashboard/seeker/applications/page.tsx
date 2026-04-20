import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getApplicationsByUserId } from "@/lib/applications";
import { formatRelativeDate } from "@/lib/utils";
import { APPLICATION_STATUS_COLORS } from "@/constants";

export default async function ApplicationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/login");

  const applications = await getApplicationsByUserId(Number(session.user.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-500 mt-1">Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-slate-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No applications yet</h3>
          <p className="text-slate-500 mb-6">Start applying to jobs to see them here.</p>
          <Link href="/jobs" className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const statusColor = APPLICATION_STATUS_COLORS[app.status] || "bg-slate-100 text-slate-700";
            return (
              <Link key={app.id} href={`/jobs/${app.job_id}`} className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900 hover:text-violet-600 transition-colors">{app.job_title}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{app.job_company}</div>
                    <div className="text-xs text-slate-400 mt-2">Applied {formatRelativeDate(app.created_at)}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor}`}>{app.status}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
