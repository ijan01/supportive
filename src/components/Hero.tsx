"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Find your next role in{" "}
            <span className="text-amber-300">mental health</span>
          </h1>
          <p className="text-lg sm:text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Roles across clinical mental health, AOD, peer work, NDIS, and community services. Posted by mission-aligned employers.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search job titles or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-full text-slate-900 placeholder-slate-400 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-300/50"
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition-all shadow-lg hover:shadow-xl"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
