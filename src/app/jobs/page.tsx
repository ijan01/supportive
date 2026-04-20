import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getJobs, getJobCount } from "@/lib/jobs";
import { JobFilters as JobFiltersType } from "@/lib/types";
import JobFilters from "@/components/JobFilters";
import JobList from "@/components/JobList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse roles",
  description: "Browse mental health and supportive services roles across Australia. Filter by role type, location, and employment type.",
};

const PAGE_SIZE = 20;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const filters: JobFiltersType = { page, limit: PAGE_SIZE };
  if (params.search) filters.search = params.search;
  if (params.location) filters.location = params.location;
  if (params.category) filters.category = params.category;
  if (params.job_type) filters.job_type = params.job_type;

  const [jobs, total] = await Promise.all([getJobs(filters), getJobCount(filters)]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.location) q.set("location", params.location);
    if (params.category) q.set("category", params.category);
    if (params.job_type) q.set("job_type", params.job_type);
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return `/jobs${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse roles</h1>
        <p className="text-slate-500">
          {total > 0
            ? `${total} role${total !== 1 ? "s" : ""} across Australia`
            : "Mental health and supportive services roles across Australia."}
        </p>
      </div>
      <div className="mb-6">
        <Suspense fallback={<div className="h-14 bg-white rounded-xl animate-pulse" />}>
          <JobFilters />
        </Suspense>
      </div>
      <JobList jobs={jobs} />

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={pageUrl(page - 1)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
              >
                &larr; Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={pageUrl(page + 1)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
              >
                Next &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
