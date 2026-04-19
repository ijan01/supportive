import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { getJobsByUserId } from "@/lib/jobs";
import { formatRelativeDate, formatSalary } from "@/lib/utils";
import { JOB_TYPE_COLORS } from "@/constants";
import DeleteJobButton from "./DeleteJobButton";

export default async function CompanyDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "company") redirect("/dashboard/seeker");

  const jobs = await getJobsByUserId(Number(session.user.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Company Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {session.user.companyName || session.user.name}</p>
        </div>
        <Link href="/dashboard/company/post-job" className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md">
          + Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="text-3xl font-bold text-violet-600">{jobs.length}</div>
          <div className="text-slate-500 text-sm font-medium">Active Jobs</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="text-3xl font-bold text-emerald-600">
            {jobs.reduce((sum, j) => sum + j.application_count, 0)}
          </div>
          <div className="text-slate-500 text-sm font-medium">Total Applications</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="text-3xl font-bold text-amber-600">
            {jobs.filter((j) => j.is_featured === 1).length}
          </div>
          <div className="text-slate-500 text-sm font-medium">Featured Jobs</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4">My Jobs</h2>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No jobs posted yet</h3>
          <p className="text-slate-500 mb-6">Create your first job posting to start receiving applications.</p>
          <Link href="/dashboard/company/post-job" className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const badge = JOB_TYPE_COLORS[job.job_type] || "bg-slate-100 text-slate-700";
            return (
              <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${job.id}`} className="text-lg font-semibold text-slate-900 hover:text-violet-600 transition-colors">
                      {job.title}
                    </Link>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge}`}>{job.job_type}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{job.location}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{job.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                      <span className="font-semibold text-slate-700">{formatSalary(job.salary_min, job.salary_max) || "Salary not listed"}</span>
                      <span>Posted {formatRelativeDate(job.created_at)}</span>
                      <span className="font-medium text-emerald-600">
                        {job.application_count} application{job.application_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/dashboard/company/edit-job/${job.id}`} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">
                      Edit
                    </Link>
                    <DeleteJobButton jobId={job.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
