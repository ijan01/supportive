"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EMPLOYER_BENEFITS, ORGANISATION_TYPES } from "@/constants";

interface ProfileData {
  name: string;
  website: string;
  description: string;
  why_work_with_us: string;
  organisation_type: string;
  benefits: string[];
  logo_url: string;
}

export default function EmployerProfileForm({ initial }: { initial: ProfileData }) {
  const router = useRouter();
  const [data, setData] = useState<ProfileData>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setSuccess(false);
  }

  function toggleBenefit(slug: string) {
    set("benefits", data.benefits.includes(slug) ? data.benefits.filter((b) => b !== slug) : [...data.benefits, slug]);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/employers/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error || "Failed to save");
    } else {
      setSuccess(true);
      router.refresh();
    }
    setSaving(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Logo must be under 2MB");
      return;
    }

    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/employers/logo", { method: "POST", body: fd });
    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Upload failed");
    } else {
      set("logo_url", result.url);
    }
    setUploading(false);
  }

  const remBenefits = EMPLOYER_BENEFITS.filter((b) => b.group === "remuneration");
  const proBenefits = EMPLOYER_BENEFITS.filter((b) => b.group === "professional");

  return (
    <div className="space-y-8">
      {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
      {success && <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 text-sm">Profile saved.</div>}

      {/* Logo */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Logo</h2>
        <div className="flex items-center gap-6">
          {data.logo_url ? (
            <img src={data.logo_url} alt="Logo" className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-2xl">
              {data.name.charAt(0) || "?"}
            </div>
          )}
          <div>
            <label className="inline-block px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
              {uploading ? "Uploading..." : data.logo_url ? "Change logo" : "Upload logo"}
              <input type="file" className="hidden" accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml" onChange={handleLogoUpload} disabled={uploading} />
            </label>
            <p className="text-xs text-slate-400 mt-2">Recommended: square image, minimum 200x200px. Max 2MB.</p>
          </div>
        </div>
      </div>

      {/* Basic details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Organisation details</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Organisation name</label>
          <input type="text" value={data.name} onChange={(e) => set("name", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
          <input type="url" value={data.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Organisation type</label>
          <select value={data.organisation_type} onChange={(e) => set("organisation_type", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
            <option value="">Select type...</option>
            {ORGANISATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea rows={4} value={data.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell candidates about your organisation, mission, and the work you do." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y text-sm" />
        </div>
      </div>

      {/* Why work with us */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Why work with us</h2>
        <p className="text-xs text-slate-400 mb-3">Describe your workplace culture, supervision approach, professional development, team environment. Max 3,000 characters.</p>
        <textarea
          rows={6}
          value={data.why_work_with_us}
          onChange={(e) => { if (e.target.value.length <= 3000) set("why_work_with_us", e.target.value); }}
          placeholder="Describe your workplace culture, supervision approach, professional development opportunities, team environment, and what makes your organisation a great place to work for mental health professionals. Be specific — candidates respond to real detail, not generic statements."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y text-sm"
        />
        <p className="text-xs text-slate-400 mt-1 text-right">{data.why_work_with_us.length} / 3,000</p>
      </div>

      {/* Benefits checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">What we offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-3">Remuneration &amp; Leave</h3>
            <div className="space-y-2">
              {remBenefits.map((b) => (
                <label key={b.slug} className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={data.benefits.includes(b.slug)} onChange={() => toggleBenefit(b.slug)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                  <span className="text-sm text-slate-700">{b.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-3">Professional Support</h3>
            <div className="space-y-2">
              {proBenefits.map((b) => (
                <label key={b.slug} className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={data.benefits.includes(b.slug)} onChange={() => toggleBenefit(b.slug)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                  <span className="text-sm text-slate-700">{b.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="px-8 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all disabled:opacity-50">
          {saving ? "Saving..." : "Save profile"}
        </button>
        <button onClick={() => router.back()} className="px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all">
          Cancel
        </button>
      </div>
    </div>
  );
}
