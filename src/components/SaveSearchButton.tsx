"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SaveSearchButton() {
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const jobType = searchParams.get("job_type") || "";

  const hasFilters = search || location || category || jobType;
  if (!hasFilters) return null;

  const label = [search, category, location, jobType].filter(Boolean).join(", ");

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/saved-searches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: label,
        search: search || undefined,
        location: location || undefined,
        category: category || undefined,
        job_type: jobType || undefined,
      }),
    });
    if (res.ok) setSaved(true);
    setSaving(false);
  }

  if (saved) {
    return (
      <span className="text-sm text-emerald-600 font-medium">
        Search saved — we'll email you when new roles match
      </span>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className="text-sm text-violet-600 font-medium hover:text-violet-700 disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save this search & get alerts"}
    </button>
  );
}
