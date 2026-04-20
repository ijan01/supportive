"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JOB_TYPES, MH_ROLES, MH_ROLE_GROUPS, AU_LOCATIONS } from "@/constants";

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const jobType = searchParams.get("job_type") || "";

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  function buildParams(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    return params.toString();
  }

  function submitSearch() {
    router.push(`/jobs?${buildParams({ search: searchValue })}`);
  }

  function updateParam(key: string, value: string) {
    router.push(`/jobs?${buildParams({ [key]: value })}`);
  }

  function clearAll() {
    setSearchValue("");
    router.push("/jobs");
  }

  const hasFilters = searchValue || location || category || jobType;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        {/* Search row */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search roles or organisations..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
          />
          <button
            onClick={submitSearch}
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors shrink-0 text-sm"
          >
            Search
          </button>
        </div>
        {/* Filter row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <select
            value={location}
            onChange={(e) => updateParam("location", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
          >
            <option value="">All locations</option>
            {AU_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>{loc.name}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
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
            onChange={(e) => updateParam("job_type", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
          >
            <option value="">All types</option>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {hasFilters ? (
            <button
              onClick={clearAll}
              className="w-full px-4 py-2.5 rounded-xl text-violet-600 font-medium hover:bg-violet-50 transition-colors text-sm border border-slate-200"
            >
              Clear filters
            </button>
          ) : (
            <div className="hidden lg:block" />
          )}
        </div>
      </div>
    </div>
  );
}
