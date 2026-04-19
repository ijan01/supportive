import { Suspense } from "react";
import { Metadata } from "next";
import { getJobs } from "@/lib/jobs";
import { JobFilters as JobFiltersType } from "@/lib/types";
import JobFilters from "@/components/JobFilters";
import JobList from "@/components/JobList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse roles",
  description: "Browse mental health and supportive services roles across Australia. Filter by role type, location, and employment type.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filters: JobFiltersType = {};
  if (params.search) filters.search = params.search;
  if (params.location) filters.location = params.location;
  if (params.category) filters.category = params.category;
  if (params.job_type) filters.job_type = params.job_type;

  const jobs = await getJobs(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse roles</h1>
        <p className="text-slate-500">Mental health and supportive services roles across Australia.</p>
      </div>
      <div className="mb-6">
        <Suspense fallback={<div className="h-14 bg-white rounded-xl animate-pulse" />}>
          <JobFilters />
        </Suspense>
      </div>
      <JobList jobs={jobs} />
    </div>
  );
}
