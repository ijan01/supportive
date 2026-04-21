"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DURATIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

export default function AdminEmployerActions({ employerId, isFeatured }: { employerId: number; isFeatured: boolean }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  async function handleToggle() {
    if (isFeatured) {
      setLoading(true);
      await fetch("/api/admin/employers/toggle-featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employer_id: employerId, featured: false }),
      });
      router.refresh();
      setLoading(false);
    } else {
      setShowModal(true);
    }
  }

  async function handleEnable() {
    setLoading(true);
    await fetch("/api/admin/employers/toggle-featured", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employer_id: employerId, featured: true, days }),
    });
    setShowModal(false);
    router.refresh();
    setLoading(false);
  }

  return (
    <>
      <button onClick={handleToggle} disabled={loading} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${isFeatured ? "border border-red-200 text-red-600 hover:bg-red-50" : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}>
        {loading ? "..." : isFeatured ? "Remove featured" : "Make featured"}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Free featured period</h3>
            <p className="text-sm text-slate-500 mb-4">Grant this employer a free featured period in the directory.</p>
            <div className="flex gap-2 mb-4">
              {DURATIONS.map((d) => (
                <button key={d.value} onClick={() => setDays(d.value)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${days === d.value ? "bg-violet-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  {d.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleEnable} disabled={loading} className="px-5 py-2 rounded-full bg-violet-600 text-white font-medium text-sm hover:bg-violet-700 disabled:opacity-50">
                {loading ? "Saving..." : `Enable for ${days} days`}
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
