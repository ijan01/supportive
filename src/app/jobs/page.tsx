import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getJobs, getJobCount } from "@/lib/jobs";
import { getSession } from "@/lib/session";
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

  const [jobs, total, session] = await Promise.all([getJobs(filters), getJobCount(filters), getSession()]);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isAnonymous = !session?.user;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Browse roles</h1>
        <p className="text-slate-500">
          {total > 0
            ? `${total} role${total !== 1 ? "s" : ""} across Australia`
            : "Mental health and supportive services roles across Australia."}
        </p>
      </div>
      <div className="mb-6">
        <Suspense fallback={<div className="h-14 bg-white rounded-2xl animate-pulse border border-slate-200" />}>
          <JobFilters />
        </Suspense>
      </div>
      {isAnonymous && (
        <div className="mb-6 rounded-2xl bg-lavender border border-violet-100 px-6 py-4">
          <p className="text-sm text-violet-700">
            <Link href="/auth/register" className="font-semibold underline hover:text-violet-900">Create a free account</Link> to save roles and track your applications.
          </p>
        </div>
      )}
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
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={pageUrl(page + 1)}
                className="px-5 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors text-sm"
              >
                Next page
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
