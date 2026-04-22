"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JOB_TYPES, MH_ROLES, MH_ROLE_GROUPS, AU_LOCATIONS, EMPLOYER_BENEFITS } from "@/constants";

const FILTER_BENEFITS = EMPLOYER_BENEFITS.filter((b) =>
  ["salary-packaging", "paid-supervision", "supervision-provided", "above-award-pay", "flexible-hybrid", "paid-pd", "telehealth-option", "ahpra-fees-covered"].includes(b.slug)
);

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const jobType = searchParams.get("job_type") || "";
  const benefitsParam = searchParams.get("benefits") || "";

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [showBenefits, setShowBenefits] = useState(!!benefitsParam);

  const selectedBenefits = benefitsParam ? benefitsParam.split(",") : [];

  function buildParams(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    params.delete("page");
    return params.toString();
  }

  function submitSearch() {
    router.push(`/jobs?${buildParams({ search: searchValue })}`);
  }

  function updateParam(key: string, value: string) {
    router.push(`/jobs?${buildParams({ [key]: value })}`);
  }

  function toggleBenefit(slug: string) {
    const updated = selectedBenefits.includes(slug)
      ? selectedBenefits.filter((b) => b !== slug)
      : [...selectedBenefits, slug];
    updateParam("benefits", updated.join(","));
  }

  function clearAll() {
    setSearchValue("");
    setShowBenefits(false);
    router.push("/jobs");
  }

  const hasFilters = searchValue || location || category || jobType || benefitsParam;

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
          <div className="flex gap-2">
            <button
              onClick={() => setShowBenefits(!showBenefits)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                selectedBenefits.length > 0
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Benefits{selectedBenefits.length > 0 ? ` (${selectedBenefits.length})` : ""}
            </button>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="px-3 py-2.5 rounded-xl text-violet-600 font-medium hover:bg-violet-50 transition-colors text-sm border border-slate-200 shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Benefits checkboxes */}
        {showBenefits && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2">Show employers offering:</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
              {FILTER_BENEFITS.map((b) => (
                <label key={b.slug} className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={selectedBenefits.includes(b.slug)}
                    onChange={() => toggleBenefit(b.slug)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-xs text-slate-600">{b.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
