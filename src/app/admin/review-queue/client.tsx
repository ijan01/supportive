"use client";

import { useState } from "react";
import { Job } from "@/lib/types";
import { MH_ROLES, MH_ROLE_GROUPS } from "@/constants";

export default function ReviewQueueClient({ jobs: initialJobs }: { jobs: Job[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [acting, setActing] = useState<number | null>(null);

  async function handleAction(id: number, action: "approve" | "reject" | "remap", roleSlug?: string) {
    setActing(id);
    try {
      const res = await fetch("/api/admin/review-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id, action, roleSlug }),
      });
      if (!res.ok) throw new Error("Failed");
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch {
      alert("Action failed. Try again.");
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900">{job.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{job.employer_name ?? job.company}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  {job.role_slug ?? "unclassified"} ({Math.round((job.role_confidence ?? 0) * 100)}%)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {job.location}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {job.source}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-3 line-clamp-3">{job.description}</p>
            </div>

            <div className="flex flex-col gap-2 shrink-0 lg:w-48">
              <button
                onClick={() => handleAction(job.id, "approve")}
                disabled={acting === job.id}
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(job.id, "reject")}
                disabled={acting === job.id}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
              <select
                onChange={(e) => {
                  if (e.target.value) handleAction(job.id, "remap", e.target.value);
                }}
                disabled={acting === job.id}
                defaultValue=""
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white disabled:opacity-50"
              >
                <option value="" disabled>Remap to...</option>
                {MH_ROLE_GROUPS.map((group) => (
                  <optgroup key={group.slug} label={group.label}>
                    {MH_ROLES.filter((r) => r.group === group.slug).map((role) => (
                      <option key={role.slug} value={role.slug}>{role.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
