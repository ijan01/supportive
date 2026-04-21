import Link from "next/link";
import { Job, JobWithEmployer } from "@/lib/types";
import { formatSalary, formatRelativeDate } from "@/lib/utils";
import { JOB_TYPE_COLORS, ORGANISATION_TYPES, EMPLOYER_BENEFITS, BENEFITS_PRIORITY } from "@/constants";

function isJobWithEmployer(job: Job | JobWithEmployer): job is JobWithEmployer {
  return "employer_logo_url" in job;
}

export default function JobCard({ job }: { job: Job | JobWithEmployer }) {
  const badgeColor = JOB_TYPE_COLORS[job.job_type] || "bg-slate-100 text-slate-700";
  const hasEmployer = isJobWithEmployer(job);
  const orgType = hasEmployer ? ORGANISATION_TYPES.find((t) => t.value === job.employer_organisation_type) : undefined;

  const benefitSlugs = hasEmployer ? job.employer_benefits : [];
  const topBenefits = BENEFITS_PRIORITY
    .filter((slug) => benefitSlugs.includes(slug))
    .slice(0, 3)
    .map((slug) => EMPLOYER_BENEFITS.find((b) => b.slug === slug))
    .filter(Boolean);

  const tier = job.listing_tier || "basic";
  const isPremium = tier === "premium";
  const isSponsored = tier === "sponsored" || job.is_boosted;

  const cardBorder = isSponsored
    ? "border-emerald-300 ring-1 ring-emerald-100"
    : isPremium
    ? "border-pink-300 ring-1 ring-pink-100"
    : "border-slate-200";

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <div className={`relative bg-white rounded-2xl border p-6 hover:shadow-lg transition-all duration-200 ${cardBorder}`}>
        {/* Tier badges */}
        <div className="absolute top-4 right-4 flex gap-1.5">
          {isPremium && (
            <>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 uppercase tracking-wide">
                Recommended
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500 text-white">
                Premium
              </span>
            </>
          )}
          {isSponsored && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white">
              Sponsored
            </span>
          )}
          {!isPremium && !isSponsored && job.is_featured === 1 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-600 text-white">
              Featured
            </span>
          )}
        </div>

        <div className="flex items-start gap-4">
          {hasEmployer && job.employer_logo_url ? (
            <img src={job.employer_logo_url} alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-100 shrink-0" />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-base shrink-0">
              {job.company.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors truncate pr-24">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-slate-500 text-sm">{job.company}</p>
              {orgType && orgType.value !== "other" && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${orgType.color}`}>
                  {orgType.label}
                </span>
              )}
            </div>
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
        {topBenefits.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {topBenefits.map((b) => (
              <span key={b!.slug} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {b!.label}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">
            {formatSalary(job.salary_min, job.salary_max) || "Salary not listed"}
          </span>
          <span className="text-slate-400 text-xs">{formatRelativeDate(job.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
