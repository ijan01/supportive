import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getJobsByUserId } from "@/lib/jobs";
import { getEmployerByUserId } from "@/lib/employers";
import { formatRelativeDate, formatSalary } from "@/lib/utils";
import { JOB_TYPE_COLORS } from "@/constants";
import DeleteJobButton from "./DeleteJobButton";
import SuccessToast from "./SuccessToast";
import DashboardActions from "./DashboardActions";
import { FeaturedSubscribeButton, FeaturedManageButton } from "./FeaturedButtons";

export const dynamic = "force-dynamic";

export default async function CompanyDashboard() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "company") redirect("/dashboard/seeker");

  const userId = Number(session.user.id);
  const [jobs, employer] = await Promise.all([
    getJobsByUserId(userId),
    getEmployerByUserId(userId),
  ]);

  const activeJobs = jobs.filter((j) => j.status === "active");
  const expiredJobs = jobs.filter((j) => j.status === "expired");
  const newApps = jobs.reduce((sum, j) => sum + j.application_count, 0);
  const boostedCount = activeJobs.filter((j) => j.is_boosted).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense><SuccessToast /></Suspense>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          {employer?.logo_url ? (
            <img src={employer.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-lg">
              {(session.user.companyName || "C").charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Employer dashboard</h1>
            <p className="text-slate-500 text-sm">Welcome back, {session.user.companyName || session.user.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/company/profile" className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm">
            Edit profile
          </Link>
          <Link href="/dashboard/company/applications" className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm">
            Applications
          </Link>
          <Link href="/dashboard/company/analytics" className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm">
            Analytics
          </Link>
          <Link href="/dashboard/company/post-job" className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all text-sm">
            Post a role
          </Link>
        </div>
      </div>

      {!employer && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Complete your profile</span> — add your logo, description, and benefits to attract better candidates.{" "}
            <Link href="/dashboard/company/profile" className="underline font-medium">Edit profile</Link>
          </p>
        </div>
      )}

      {/* Featured employer banner */}
      {employer && employer.featured && (!employer.featured_until || new Date(employer.featured_until) > new Date()) ? (
        <div className="mb-6 p-5 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-800">&#11088; You are a Featured Employer</p>
              {employer.featured_until && (
                <p className="text-xs text-amber-600 mt-0.5">Renews {new Date(employer.featured_until).toLocaleDateString("en-AU")}</p>
              )}
            </div>
            <FeaturedManageButton />
          </div>
        </div>
      ) : employer ? (
        <div className="mb-6 p-5 rounded-xl bg-violet-50 border border-violet-200">
          <h3 className="text-sm font-semibold text-violet-900 mb-1">Get featured in the employer directory</h3>
          <p className="text-xs text-violet-700 mb-3">Featured employers appear at the top of directory results, stay visible even between hiring cycles, and get an enhanced profile card.</p>
          <ul className="text-xs text-violet-700 space-y-1 mb-3">
            <li>&#10003; Featured placement in the employer directory</li>
            <li>&#10003; Listed even when you have no active roles</li>
            <li>&#10003; &quot;Featured Employer&quot; badge on your profile and all listings</li>
            <li>&#10003; Cancel anytime</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <FeaturedSubscribeButton plan="monthly" />
            <FeaturedSubscribeButton plan="annual" />
          </div>
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-violet-600">{activeJobs.length}</div>
          <div className="text-slate-500 text-xs font-medium">Active Jobs</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-emerald-600">{newApps}</div>
          <div className="text-slate-500 text-xs font-medium">Applications</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-amber-600">{boostedCount}</div>
          <div className="text-slate-500 text-xs font-medium">Boosted</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-2xl font-bold text-slate-400">{expiredJobs.length}</div>
          <div className="text-slate-500 text-xs font-medium">Expired</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4">My Jobs</h2>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
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
            const isExpired = job.status === "expired";
            const daysLeft = job.valid_through ? Math.max(0, Math.ceil((new Date(job.valid_through).getTime() - Date.now()) / 86400000)) : null;
            const boostDaysLeft = job.boosted_until ? Math.max(0, Math.ceil((new Date(job.boosted_until).getTime() - Date.now()) / 86400000)) : 0;

            return (
              <div key={job.id} className={`bg-white rounded-xl border p-6 hover:shadow-md transition-all ${isExpired ? "border-slate-200 opacity-70" : job.is_boosted ? "border-emerald-300 ring-1 ring-emerald-100" : "border-slate-200"}`}>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Link href={`/jobs/${job.id}`} className="text-lg font-semibold text-slate-900 hover:text-violet-600 transition-colors">
                        {job.title}
                      </Link>
                      {isExpired && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">Expired</span>}
                      {job.is_boosted && boostDaysLeft > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          Boosted — {boostDaysLeft}d left
                        </span>
                      )}
                      {!isExpired && !job.is_boosted && daysLeft !== null && daysLeft <= 7 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                          Expires in {daysLeft}d
                        </span>
                      )}
                    </div>
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
                      {job.view_count > 0 && <span>{job.view_count} views</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 flex-shrink-0 items-start">
                    {!isExpired && (
                      <Link href={`/dashboard/company/edit-job/${job.id}`} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">
                        Edit
                      </Link>
                    )}
                    <DashboardActions jobId={job.id} isExpired={isExpired} isBoosted={job.is_boosted && boostDaysLeft > 0} />
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
