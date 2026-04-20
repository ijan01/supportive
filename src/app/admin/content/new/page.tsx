"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewContentPlanPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      action: "create",
      article_number: Number(form.get("article_number")),
      title: form.get("title"),
      slug: form.get("slug") || undefined,
      content_type: form.get("content_type"),
      target_keyword: form.get("target_keyword") || undefined,
      secondary_keywords: form.get("secondary_keywords") || undefined,
      target_role: form.get("target_role") || undefined,
      pillar_parent_id: form.get("pillar_parent_id") ? Number(form.get("pillar_parent_id")) : undefined,
      status: form.get("status"),
      target_word_count_min: form.get("target_word_count_min") ? Number(form.get("target_word_count_min")) : undefined,
      target_word_count_max: form.get("target_word_count_max") ? Number(form.get("target_word_count_max")) : undefined,
      target_publish_date: form.get("target_publish_date") || undefined,
      notes: form.get("notes") || undefined,
    };

    const res = await fetch("/api/admin/content-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create");
      setSaving(false);
      return;
    }

    router.push("/admin/content");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/content" className="text-sm text-violet-600 hover:text-violet-700 font-medium">Content Plan</Link>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">New article</h1>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Article Number</label>
            <input name="article_number" type="number" required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Content Type</label>
            <select name="content_type" required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
              <option value="PILLAR">Pillar</option>
              <option value="CLUSTER">Cluster</option>
              <option value="CONVERSION">Conversion</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
          <input name="title" required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Target Keyword</label>
            <input name="target_keyword" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Secondary Keywords</label>
            <input name="secondary_keywords" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Target Role (slug)</label>
            <input name="target_role" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Pillar Parent (article #)</label>
            <input name="pillar_parent_id" type="number" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
            <select name="status" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
              {["Planned", "Brief Ready", "Draft", "In Review", "Published"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Word Count Min</label>
            <input name="target_word_count_min" type="number" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Word Count Max</label>
            <input name="target_word_count_max" type="number" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Slug</label>
            <input name="slug" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Target Publish Date</label>
            <input name="target_publish_date" type="date" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
          <textarea name="notes" rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Creating..." : "Create article"}
          </button>
          <Link href="/admin/content" className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
