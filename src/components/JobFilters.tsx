"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { JOB_TYPES, MH_ROLES, MH_ROLE_GROUPS, AU_LOCATIONS } from "@/constants";

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const jobType = searchParams.get("job_type") || "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/jobs?${params.toString()}`);
  }

  function clearAll() {
    router.push("/jobs");
  }

  const hasFilters = search || location || category || jobType;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search roles or organisations..."
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParams("search", e.currentTarget.value);
          }}
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
        <select
          value={location}
          onChange={(e) => updateParams("location", e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
        >
          <option value="">All locations</option>
          {AU_LOCATIONS.map((loc) => (
            <option key={loc.name} value={loc.name}>{loc.name}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => updateParams("category", e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
        >
          <option value="">All roles</option>
          {MH_ROLE_GROUPS.map((group) => (
            <optgroup key={group.slug} label={group.label}>
              {MH_ROLES.filter((r) => r.group === group.slug).map((role) => (
                <option key={role.slug} value={role.name}>{role.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <select
          value={jobType}
          onChange={(e) => updateParams("job_type", e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
        >
          <option value="">All types</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="px-4 py-2.5 rounded-lg text-violet-600 font-medium hover:bg-violet-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
