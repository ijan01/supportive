"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JOB_TYPES, MH_ROLES, MH_ROLE_GROUPS, AU_LOCATIONS } from "@/constants";
import { Job } from "@/lib/types";

interface PostJobFormProps {
  defaultCompany?: string;
  existingJob?: Job;
}

export default function PostJobForm({ defaultCompany = "", existingJob }: PostJobFormProps) {
  const [title, setTitle] = useState(existingJob?.title || "");
  const [company, setCompany] = useState(existingJob?.company || defaultCompany);
  const [location, setLocation] = useState(existingJob?.location || "Sydney, NSW");
  const [category, setCategory] = useState(existingJob?.category || MH_ROLES[0].name);
  const [jobType, setJobType] = useState(existingJob?.job_type || "Full-time");
  const [salaryMin, setSalaryMin] = useState(existingJob?.salary_min?.toString() || "");
  const [salaryMax, setSalaryMax] = useState(existingJob?.salary_max?.toString() || "");
  const [description, setDescription] = useState(existingJob?.description || "");
  const [requirements, setRequirements] = useState(existingJob?.requirements || "");
  const [applyUrl, setApplyUrl] = useState(existingJob?.apply_url || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!existingJob && defaultCompany) setCompany(defaultCompany);
  }, [defaultCompany, existingJob]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      title, company, location, category, job_type: jobType,
      salary_min: salaryMin ? Number(salaryMin) : undefined,
      salary_max: salaryMax ? Number(salaryMax) : undefined,
      description, requirements, apply_url: applyUrl,
    };

    try {
      const url = existingJob ? `/api/jobs/${existingJob.id}` : "/api/jobs";
      const method = existingJob ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save job");

      router.push("/dashboard/company");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
        <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
            {AU_LOCATIONS.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Role category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
            {MH_ROLE_GROUPS.map((group) => (
              <optgroup key={group.slug} label={group.label}>
                {MH_ROLES.filter((r) => r.group === group.slug).map((role) => (
                  <option key={role.slug} value={role.name}>{role.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Type *</label>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Salary min (AUD)</label>
          <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="80000" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Salary max (AUD)</label>
          <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="120000" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
        <textarea required rows={6} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Requirements *</label>
        <textarea required rows={5} value={requirements} onChange={(e) => setRequirements(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">External Apply URL</label>
        <input type="url" value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50">
          {loading ? "Saving..." : existingJob ? "Update Job" : "Post Job"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}
