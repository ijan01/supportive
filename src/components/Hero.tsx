"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MH_ROLES, MH_ROLE_GROUPS, AU_LOCATIONS } from "@/constants";

export default function Hero() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    const qs = params.toString();
    router.push(`/jobs${qs ? `?${qs}` : ""}`);
  };

  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          Find <span className="text-highlight">meaningful</span> careers in{" "}
          <span className="text-highlight">mental health</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Browse clinical, community, AOD, peer work, and NDIS roles posted by mission-aligned employers across Australia.
        </p>

        <form onSubmit={handleSearch} className="mt-10 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-3 sm:p-4">
            {/* Search row */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Search roles or organisations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-6 sm:px-8 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all shrink-0 text-sm"
              >
                Search
              </button>
            </div>
            {/* Filter row */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm text-slate-600"
              >
                <option value="">All locations</option>
                {AU_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm text-slate-600"
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
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
