import { Job } from "@/lib/types";
import JobCard from "./JobCard";

export default function JobList({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No jobs found</h3>
        <p className="text-slate-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
