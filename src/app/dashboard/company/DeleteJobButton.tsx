"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteJobButton({ jobId }: { jobId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this job?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete job");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
