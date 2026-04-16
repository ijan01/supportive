"use client";

import { useState } from "react";

export default function SaveJobButton({ jobId, initialSaved }: { jobId: number; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 font-medium transition-all ${
        saved
          ? "border-violet-600 bg-violet-50 text-violet-600"
          : "border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
      }`}
    >
      <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {saved ? "Saved" : "Save Job"}
    </button>
  );
}
