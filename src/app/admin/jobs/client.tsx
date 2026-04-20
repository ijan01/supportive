"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminJobActions({ jobId, status }: { jobId: number; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(action: string) {
    if (action === "delete" && !confirm("Delete this job permanently?")) return;
    setLoading(true);
    await fetch("/api/admin/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, action }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-1">
      {status !== "active" && (
        <button onClick={() => handleAction("approve")} disabled={loading} className="px-2 py-1 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50">
          Approve
        </button>
      )}
      {status !== "rejected" && (
        <button onClick={() => handleAction("reject")} disabled={loading} className="px-2 py-1 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50">
          Reject
        </button>
      )}
      <button onClick={() => handleAction("delete")} disabled={loading} className="px-2 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
        Delete
      </button>
    </div>
  );
}
