"use client";

import { useState } from "react";
import { Job } from "@/lib/types";
import { MH_ROLES, MH_ROLE_GROUPS } from "@/constants";

export default function ReviewQueueClient({ jobs: initialJobs }: { jobs: Job[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [acting, setActing] = useState<number | null>(null);
  const [bulkActing, setBulkActing] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

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

  async function handleBulk(action: "approve" | "reject") {
    if (!confirm(`${action === "approve" ? "Approve" : "Reject"} all ${jobs.length} jobs?`)) return;
    setBulkActing(true);
    const ids = jobs.map((j) => j.id);
    let failed = 0;
    for (const id of ids) {
      try {
        const res = await fetch("/api/admin/review-queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: id, action }),
        });
        if (!res.ok) failed++;
        else setJobs((prev) => prev.filter((j) => j.id !== id));
      } catch {
        failed++;
      }
    }
    setBulkActing(false);
    if (failed > 0) alert(`${failed} job(s) failed to ${action}.`);
  }

  function toggleExpand(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function formatSalary(min: number | null, max: number | null, predicted: boolean) {
    if (!min && !max) return null;
    const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
    const range = min && max ? `${fmt(min)} – ${fmt(max)}` : min ? `${fmt(min)}+` : `Up to ${fmt(max!)}`;
    return predicted ? `${range} (est.)` : range;
  }

  function timeAgo(dateStr: string | null) {
    if (!dateStr) return null;
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Queue cleared — no jobs to review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
        <span className="text-sm text-slate-600 font-medium">{jobs.length} job{jobs.length !== 1 ? "s" : ""} in queue</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleBulk("approve")}
            disabled={bulkActing}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {bulkActing ? "Working..." : "Approve all"}
          </button>
          <button
            onClick={() => handleBulk("reject")}
            disabled={bulkActing}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {bulkActing ? "Working..." : "Reject all"}
          </button>
        </div>
      </div>

      {jobs.map((job) => {
        const salary = formatSalary(job.salary_min, job.salary_max, job.salary_is_predicted);
        const posted = timeAgo(job.posted_date);
        const isExpanded = expanded.has(job.id);

        return (
          <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  {job.apply_url && (
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs text-violet-600 hover:text-violet-700 mt-0.5"
                    >
                      View listing
                    </a>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{job.employer_name ?? job.company}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    {job.role_slug ?? "unclassified"} ({Math.round((job.role_confidence ?? 0) * 100)}%)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {job.location}
                  </span>
                  {job.location_state && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {job.location_state}
                    </span>
                  )}
                  {!job.location_state && !job.is_remote && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                      No state
                    </span>
                  )}
                  {job.is_remote && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      Remote
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {job.job_type}
                  </span>
                  {salary && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {salary}
                    </span>
                  )}
                  {posted && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-500">
                      {posted}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <p className={`text-sm text-slate-600 ${isExpanded ? "" : "line-clamp-2"}`}>
                    {job.description}
                  </p>
                  {job.description && job.description.length > 200 && (
                    <button
                      onClick={() => toggleExpand(job.id)}
                      className="text-xs text-violet-600 hover:text-violet-700 mt-1"
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0 lg:w-48">
                <button
                  onClick={() => handleAction(job.id, "approve")}
                  disabled={acting === job.id || bulkActing}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(job.id, "reject")}
                  disabled={acting === job.id || bulkActing}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
                <select
                  onChange={(e) => {
                    if (e.target.value) handleAction(job.id, "remap", e.target.value);
                  }}
                  disabled={acting === job.id || bulkActing}
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
        );
      })}
    </div>
  );
}
