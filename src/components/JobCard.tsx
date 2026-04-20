import Link from "next/link";
import { Job } from "@/lib/types";
import { formatSalary, formatRelativeDate } from "@/lib/utils";
import { JOB_TYPE_COLORS } from "@/constants";

export default function JobCard({ job }: { job: Job }) {
  const badgeColor = JOB_TYPE_COLORS[job.job_type] || "bg-slate-100 text-slate-700";

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <div className="relative bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
        {job.is_featured === 1 && (
          <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-white">
            Featured
          </span>
        )}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-600 font-bold text-lg shrink-0">
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-slate-500 text-sm mt-0.5">{job.company}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            {job.job_type}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            {job.location}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            {job.category}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">
            {formatSalary(job.salary_min, job.salary_max) || "Salary not listed"}
          </span>
          <div className="flex items-center gap-2">
            {job.apply_url && (
              <span className="text-xs text-slate-400">External</span>
            )}
            <span className="text-slate-400">{formatRelativeDate(job.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
