"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { EmployerWithJobCount } from "@/lib/types";
import { ORGANISATION_TYPES, EMPLOYER_BENEFITS, BENEFITS_PRIORITY } from "@/constants";

const FILTER_ORG_TYPES = ORGANISATION_TYPES.filter((t) => t.value !== "other");
const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
const FILTER_BENEFITS = EMPLOYER_BENEFITS.filter((b) =>
  ["salary-packaging", "paid-supervision", "supervision-provided", "above-award-pay", "flexible-hybrid", "paid-pd", "telehealth-option", "ahpra-fees-covered"].includes(b.slug)
);

function isFeaturedNow(e: EmployerWithJobCount): boolean {
  return e.featured && (!e.featured_until || new Date(e.featured_until) > new Date());
}

export default function DirectoryClient({ employers }: { employers: EmployerWithJobCount[] }) {
  const [search, setSearch] = useState("");
  const [orgTypes, setOrgTypes] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [activeOnly, setActiveOnly] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  function toggleFilter(arr: string[], val: string, setter: (v: string[]) => void) {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }

  const filtered = useMemo(() => {
    return employers.filter((e) => {
      if (search.length >= 2 && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (orgTypes.length > 0 && (!e.organisation_type || !orgTypes.includes(e.organisation_type))) return false;
      if (benefits.length > 0 && !benefits.every((b) => e.benefits.includes(b))) return false;
      if (activeOnly && e.active_job_count === 0 && !isFeaturedNow(e)) return false;
      return true;
    });
  }, [employers, search, orgTypes, benefits, activeOnly]);

  const hasFilters = search.length >= 2 || orgTypes.length > 0 || benefits.length > 0 || !activeOnly;

  function clearAll() {
    setSearch("");
    setOrgTypes([]);
    setBenefits([]);
    setActiveOnly(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          Mental Health Employers in Australia
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Browse organisations hiring mental health professionals across Australia. From private practices to NDIS providers, government health services, and community NFPs.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter sidebar */}
        <div className="lg:w-64 shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm mb-4 flex items-center justify-between"
          >
            Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-violet-500" />}
            <svg className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            {/* Active listings toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-10 h-5 rounded-full transition-colors ${activeOnly ? "bg-violet-600" : "bg-slate-200"}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${activeOnly ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">Has active listings</span>
              </label>
              <input type="checkbox" className="hidden" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />
            </div>

            {/* Org type */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Organisation type</h3>
              <div className="space-y-1.5">
                {FILTER_ORG_TYPES.map((t) => (
                  <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={orgTypes.includes(t.value)} onChange={() => toggleFilter(orgTypes, t.value, setOrgTypes)} className="h-3.5 w-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                    <span className="text-sm text-slate-600">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Benefits</h3>
              <div className="space-y-1.5">
                {FILTER_BENEFITS.map((b) => (
                  <label key={b.slug} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={benefits.includes(b.slug)} onChange={() => toggleFilter(benefits, b.slug, setBenefits)} className="h-3.5 w-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                    <span className="text-sm text-slate-600">{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button onClick={clearAll} className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employers..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
            />
          </div>

          <p className="text-sm text-slate-500 mb-4">{filtered.length} employer{filtered.length !== 1 ? "s" : ""}</p>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 mb-4">No employers match your filters. Try adjusting your search or clearing some filters.</p>
              <button onClick={clearAll} className="px-5 py-2 rounded-full bg-violet-600 text-white font-medium text-sm hover:bg-violet-700 transition-all">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((e) => (
                <EmployerCard key={e.id} employer={e} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployerCard({ employer }: { employer: EmployerWithJobCount }) {
  const featured = isFeaturedNow(employer);
  const orgType = ORGANISATION_TYPES.find((t) => t.value === employer.organisation_type);
  const topBenefits = BENEFITS_PRIORITY
    .filter((slug) => employer.benefits.includes(slug))
    .slice(0, 3)
    .map((slug) => EMPLOYER_BENEFITS.find((b) => b.slug === slug))
    .filter(Boolean);

  return (
    <Link href={`/employers/${employer.slug}`} className="group block">
      <div className={`relative bg-white rounded-2xl border p-5 transition-all hover:shadow-lg ${featured ? "border-l-4 border-l-emerald-500 border-t border-r border-b border-t-slate-200 border-r-slate-200 border-b-slate-200 shadow-md" : "border-slate-200"}`}>
        {featured && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
            &#11088; Featured
          </span>
        )}
        <div className="flex items-start gap-3 mb-3">
          {employer.logo_url ? (
            <img src={employer.logo_url} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm shrink-0">
              {employer.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors truncate text-sm">
              {employer.name}
            </h3>
            {orgType && orgType.value !== "other" && (
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${orgType.color}`}>
                {orgType.label}
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-500 mb-2">
          {employer.active_job_count > 0 ? (
            <span className="font-medium text-emerald-600">{employer.active_job_count} active role{employer.active_job_count !== 1 ? "s" : ""}</span>
          ) : (
            <span className="text-slate-400">No current openings</span>
          )}
        </div>

        {topBenefits.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {topBenefits.map((b) => (
              <span key={b!.slug} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {b!.label}
              </span>
            ))}
          </div>
        )}

        <span className="text-xs text-violet-600 font-medium group-hover:underline">View employer &rarr;</span>
      </div>
    </Link>
  );
}
