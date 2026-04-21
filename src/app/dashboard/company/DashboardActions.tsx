"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  jobId: number;
  isExpired: boolean;
  isBoosted: boolean;
}

export default function DashboardActions({ jobId, isExpired, isBoosted }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDuplicate() {
    setLoading("duplicate");
    const res = await fetch(`/api/jobs/${jobId}/duplicate`, { method: "POST" });
    const data = await res.json();
    if (res.ok && data.job?.id) {
      router.push(`/dashboard/company/edit-job/${data.job.id}`);
    } else {
      alert(data.error || "Failed to duplicate");
    }
    setLoading(null);
  }

  async function handleRenew() {
    if (!confirm("Renew this listing? This will reactivate it for another 28 days at no cost.")) return;
    setLoading("renew");
    const res = await fetch(`/api/jobs/${jobId}/renew`, { method: "POST" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to renew");
    }
    setLoading(null);
  }

  async function handleBoost() {
    setLoading("boost");
    const res = await fetch("/api/boosts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: jobId }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Failed to start boost");
      setLoading(null);
    }
  }

  return (
    <>
      <button onClick={handleDuplicate} disabled={loading === "duplicate"} className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50">
        {loading === "duplicate" ? "..." : "Duplicate"}
      </button>

      {isExpired && (
        <button onClick={handleRenew} disabled={loading === "renew"} className="px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors text-sm font-medium disabled:opacity-50">
          {loading === "renew" ? "..." : "Renew"}
        </button>
      )}

      {!isExpired && !isBoosted && (
        <button onClick={handleBoost} disabled={loading === "boost"} className="px-3 py-2 rounded-lg border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors text-sm font-medium disabled:opacity-50">
          {loading === "boost" ? "..." : "Boost — $99"}
        </button>
      )}
    </>
  );
}
