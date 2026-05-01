"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ContentPlanItem } from "@/lib/content-plan";

const TYPE_COLORS: Record<string, string> = {
  PILLAR: "bg-emerald-100 text-emerald-700",
  CLUSTER: "bg-blue-100 text-blue-700",
  CONVERSION: "bg-amber-100 text-amber-700",
};

const STATUS_COLORS: Record<string, string> = {
  Planned: "bg-slate-100 text-slate-600",
  "Brief Ready": "bg-violet-100 text-violet-700",
  Draft: "bg-amber-100 text-amber-700",
  "In Review": "bg-blue-100 text-blue-700",
  Published: "bg-emerald-100 text-emerald-700",
};

const ROLE_GROUPS = [
  { key: "psychologist", label: "Psychologist", color: "border-emerald-500" },
  { key: "clinical-psychologist", label: "Clinical Psychologist", color: "border-teal-500" },
  { key: "counsellor", label: "Counsellor", color: "border-blue-500" },
  { key: "mental-health-nurse", label: "Mental Health Nurse", color: "border-purple-500" },
  { key: "social-worker", label: "Social Worker", color: "border-indigo-500" },
  { key: "occupational-therapist", label: "Occupational Therapist", color: "border-cyan-500" },
  { key: "behaviour-support-practitioner", label: "Behaviour Support Practitioner", color: "border-orange-500" },
  { key: "drug-alcohol-worker", label: "Drug & Alcohol / AOD", color: "border-amber-500" },
  { key: "peer-support-worker", label: "Peer Support & Lived Experience", color: "border-pink-500", includes: ["peer-support-worker", "lived-experience-worker", "psychosocial-recovery-coach"] },
  { key: "youth-worker-mh", label: "Youth Worker", color: "border-rose-500" },
  { key: "allied-health-assistant", label: "Allied Health Assistant", color: "border-lime-500" },
  { key: "art-music-therapist", label: "Art / Music Therapy", color: "border-fuchsia-500" },
  { key: "exercise-physiologist-mh", label: "Exercise Physiology", color: "border-sky-500" },
  { key: "family-relationship-therapist", label: "Family & Relationship Therapy", color: "border-violet-500" },
  { key: "psychiatrist", label: "Psychiatrist", color: "border-red-500" },
  { key: null, label: "Cross-Role / Sector", color: "border-slate-500" },
];

function matchesRoleGroup(role: string | null, group: typeof ROLE_GROUPS[number]): boolean {
  if (group.key === null) return role === null;
  if ("includes" in group && group.includes) return group.includes.includes(role || "");
  return role === group.key;
}

interface Props {
  items: ContentPlanItem[];
  stats: Record<string, number>;
}

export default function ContentPlanClient({ items, stats }: Props) {
  const router = useRouter();
  const [view, setView] = useState<"map" | "table">("map");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [editItem, setEditItem] = useState<ContentPlanItem | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkModal, setBulkModal] = useState(false);

  const filtered = items.filter((item) => {
    if (filterStatus && item.status !== filterStatus) return false;
    if (filterType && item.content_type !== filterType) return false;
    if (filterRole && item.target_role !== filterRole) return false;
    return true;
  });

  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const pillars = items.filter((i) => i.content_type === "PILLAR");

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 10) next.add(id);
      return next;
    });
  }

  const selectableItems = filtered.filter((i) => i.status !== "Published" && i.status !== "Draft");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <Link href="/admin" className="text-violet-600 hover:text-violet-700 font-medium">Admin</Link>
            <span className="text-slate-300">&rsaquo;</span>
            <span className="text-slate-500">Content Plan</span>
            <span className="text-slate-300 mx-1">|</span>
            <Link href="/admin/blog" className="text-violet-600 hover:text-violet-700 font-medium">Blog</Link>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Content Plan</h1>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
            {["Planned", "Brief Ready", "Draft", "In Review", "Published"].map((s) => (
              <span key={s}>{s}: <strong className="text-slate-700">{stats[s] || 0}</strong></span>
            ))}
            <span>Total: <strong className="text-slate-700">{total}</strong></span>
          </div>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={() => setBulkModal(true)}
              className="px-4 py-2 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700"
            >
              Bulk Generate ({selected.size})
            </button>
          )}
          <Link href="/admin/content/new" className="px-4 py-2 rounded-full bg-violet-600 text-white font-medium text-sm hover:bg-violet-700">
            New article
          </Link>
        </div>
      </div>

      {/* Filters + View toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
          <option value="">All statuses</option>
          {["Planned", "Brief Ready", "Draft", "In Review", "Published"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
          <option value="">All types</option>
          <option value="PILLAR">Pillar</option>
          <option value="CLUSTER">Cluster</option>
          <option value="CONVERSION">Conversion</option>
        </select>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
          <option value="">All roles</option>
          {ROLE_GROUPS.filter((g) => g.key).map((g) => <option key={g.key} value={g.key!}>{g.label}</option>)}
        </select>
        <div className="ml-auto flex gap-1 bg-slate-100 rounded-xl p-1">
          <button onClick={() => setView("map")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "map" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Map</button>
          <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "table" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Table</button>
        </div>
      </div>

      {view === "table" ? (
        <TableView items={filtered} onEdit={setEditItem} selected={selected} onToggle={toggleSelect} />
      ) : (
        <MapView items={filtered} allItems={items} pillars={pillars} onEdit={setEditItem} selected={selected} onToggle={toggleSelect} />
      )}

      {editItem && (
        <EditModal
          item={editItem}
          pillars={pillars}
          onClose={() => setEditItem(null)}
          onSaved={() => { setEditItem(null); router.refresh(); }}
        />
      )}

      {bulkModal && (
        <BulkGenerateModal
          items={items.filter((i) => selected.has(i.id))}
          onClose={() => { setBulkModal(false); setSelected(new Set()); router.refresh(); }}
        />
      )}
    </div>
  );
}

function TableView({ items, onEdit, selected, onToggle }: { items: ContentPlanItem[]; onEdit: (item: ContentPlanItem) => void; selected: Set<number>; onToggle: (id: number) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-3 py-3 w-8" />
              <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">#</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Keyword</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="px-3 py-3">
                  {item.status !== "Published" && (
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => onToggle(item.id)}
                      className="accent-violet-600"
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{item.article_number}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onEdit(item)} className="font-medium text-slate-900 hover:text-violet-600 text-left">{item.title}</button>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[item.content_type]}`}>{item.content_type}</span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{item.target_role || "—"}</td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-[180px] truncate">{item.target_keyword}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(item)} className="px-2 py-1 rounded-lg text-xs font-medium text-violet-600 hover:bg-violet-50">Edit</button>
                    {item.slug && item.status !== "Planned" && item.status !== "Published" && (
                      <a href={`/admin/blog/edit?slug=${item.slug}`} className="px-2 py-1 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50">Draft</a>
                    )}
                    {item.published_url && (
                      <a href={item.published_url} target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">View</a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MapView({ items, allItems, pillars, onEdit, selected, onToggle }: { items: ContentPlanItem[]; allItems: ContentPlanItem[]; pillars: ContentPlanItem[]; onEdit: (item: ContentPlanItem) => void; selected: Set<number>; onToggle: (id: number) => void }) {
  const itemSet = new Set(items.map((i) => i.id));
  const conversions = items.filter((i) => i.content_type === "CONVERSION");

  return (
    <div className="space-y-10">
      {ROLE_GROUPS.map((group) => {
        const groupPillars = pillars.filter((p) => matchesRoleGroup(p.target_role, group) && itemSet.has(p.id));
        const groupClusters = allItems.filter((i) => i.content_type === "CLUSTER" && matchesRoleGroup(i.target_role, group) && itemSet.has(i.id));
        if (groupPillars.length === 0 && groupClusters.length === 0) return null;

        const total = groupPillars.length + groupClusters.length;
        const published = [...groupPillars, ...groupClusters].filter((i) => i.status === "Published").length;

        return (
          <div key={group.key ?? "cross"}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-1 h-6 rounded-full border-l-4 ${group.color}`} />
              <h2 className="text-lg font-bold text-slate-900">{group.label}</h2>
              <span className="text-xs text-slate-400">{published} of {total} published</span>
            </div>

            <div className="space-y-4 ml-3">
              {groupPillars.map((pillar) => {
                const clusters = allItems.filter((i) => i.content_type === "CLUSTER" && i.pillar_parent_id === pillar.article_number && itemSet.has(i.id));
                return (
                  <div key={pillar.id}>
                    <ContentCard item={pillar} onEdit={onEdit} borderColor={group.color} selected={selected.has(pillar.id)} onToggle={() => onToggle(pillar.id)} />
                    {clusters.length > 0 && (
                      <div className="ml-6 mt-2 space-y-2 border-l-2 border-slate-200 pl-4">
                        {clusters.map((cluster) => (
                          <ContentCard key={cluster.id} item={cluster} onEdit={onEdit} small selected={selected.has(cluster.id)} onToggle={() => onToggle(cluster.id)} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {conversions.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full border-l-4 border-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Conversion Content</h2>
            <span className="text-xs text-slate-400">{conversions.filter((i) => i.status === "Published").length} of {conversions.length} published</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-3">
            {conversions.map((item) => (
              <ContentCard key={item.id} item={item} onEdit={onEdit} small selected={selected.has(item.id)} onToggle={() => onToggle(item.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContentCard({ item, onEdit, borderColor, small, selected, onToggle }: { item: ContentPlanItem; onEdit: (item: ContentPlanItem) => void; borderColor?: string; small?: boolean; selected?: boolean; onToggle?: () => void }) {
  const isPublished = item.status === "Published";
  const isPlanned = item.status === "Planned";

  return (
    <button
      onClick={() => onEdit(item)}
      className={`block w-full text-left rounded-xl p-4 transition-all hover:shadow-md ${
        isPublished ? "bg-white border border-slate-200 opacity-70" :
        isPlanned ? "bg-white border-2 border-dashed border-slate-200" :
        "bg-white border border-slate-200"
      } ${!small && borderColor ? `border-l-4 ${borderColor}` : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400 font-mono">#{item.article_number}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${TYPE_COLORS[item.content_type]}`}>{item.content_type}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[item.status]}`}>{item.status}</span>
          </div>
          <p className={`font-medium ${small ? "text-sm" : "text-base"} ${isPublished ? "text-slate-500" : "text-slate-900"}`}>{item.title}</p>
          <p className="text-xs text-slate-400 mt-1 truncate">{item.target_keyword}</p>
          <div className="flex items-center gap-2 mt-1">
            {item.target_role && <span className="text-[10px] text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded inline-block">{item.target_role}</span>}
            {item.slug && !isPlanned && (
              <a
                href={`/admin/blog/edit?slug=${item.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded inline-block hover:bg-emerald-100"
              >
                View Draft
              </a>
            )}
          </div>
        </div>
        {isPublished ? (
          <span className="text-emerald-500 shrink-0">&#10003;</span>
        ) : onToggle ? (
          <input
            type="checkbox"
            checked={selected || false}
            onChange={(e) => { e.stopPropagation(); onToggle(); }}
            onClick={(e) => e.stopPropagation()}
            className="accent-violet-600 shrink-0"
          />
        ) : null}
      </div>
    </button>
  );
}

function EditModal({ item, pillars, onClose, onSaved }: { item: ContentPlanItem; pillars: ContentPlanItem[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ ...item });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<{ slug: string; title: string; blogPostId: number } | null>(null);
  const [generateError, setGenerateError] = useState("");

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/content-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, action: "update" }),
    });
    setSaving(false);
    onSaved();
  }

  async function handleGenerate() {
    setGenerating(true);
    setGenerateError("");
    setGenerateResult(null);
    setForm((prev) => ({ ...prev, status: "Draft" as const }));

    try {
      const res = await fetch("/api/admin/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: form.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setGenerateResult({ slug: data.slug, title: data.title, blogPostId: data.blogPostId });
      setForm((prev) => ({ ...prev, slug: data.slug, status: "Draft" as const }));
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Generation failed");
      setForm((prev) => ({ ...prev, status: item.status }));
    } finally {
      setGenerating(false);
    }
  }

  async function handleMarkPublished() {
    const url = prompt("Enter the published URL:");
    if (!url) return;
    setSaving(true);
    await fetch("/api/admin/content-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", id: form.id, status: "Published", published_url: url, published_at: new Date().toISOString() }),
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Edit Article #{form.article_number}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Slug</label>
              <input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Content Type</label>
              <select value={form.content_type} onChange={(e) => set("content_type", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
                <option value="PILLAR">Pillar</option>
                <option value="CLUSTER">Cluster</option>
                <option value="CONVERSION">Conversion</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Target Keyword</label>
              <input value={form.target_keyword || ""} onChange={(e) => set("target_keyword", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Secondary Keywords</label>
              <input value={form.secondary_keywords || ""} onChange={(e) => set("secondary_keywords", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Target Role</label>
              <input value={form.target_role || ""} onChange={(e) => set("target_role", e.target.value || null)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Pillar Parent</label>
              <select value={form.pillar_parent_id || ""} onChange={(e) => set("pillar_parent_id", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
                <option value="">None</option>
                {pillars.map((p) => (
                  <option key={p.article_number} value={p.article_number}>#{p.article_number} — {p.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
                {["Planned", "Brief Ready", "Draft", "In Review", "Published"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Word Count Min</label>
              <input type="number" value={form.target_word_count_min || ""} onChange={(e) => set("target_word_count_min", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Word Count Max</label>
              <input type="number" value={form.target_word_count_max || ""} onChange={(e) => set("target_word_count_max", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Target Publish Date</label>
            <input type="date" value={form.target_publish_date || ""} onChange={(e) => set("target_publish_date", e.target.value || null)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea rows={3} value={form.notes || ""} onChange={(e) => set("notes", e.target.value || null)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none" />
          </div>
        </div>

        {generating && (
          <div className="mt-4 p-4 rounded-xl bg-violet-50 border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin shrink-0" />
              <p className="text-sm text-violet-700 font-medium">Researching and writing article... This may take up to 2 minutes.</p>
            </div>
          </div>
        )}

        {generateResult && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-sm text-emerald-700 font-medium mb-2">Draft generated successfully!</p>
            <a href={`/admin/blog/edit?id=${generateResult.blogPostId}`} className="text-sm text-emerald-600 underline hover:text-emerald-700">
              Edit draft in blog editor →
            </a>
          </div>
        )}

        {generateError && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">
            <p className="text-sm text-red-700">{generateError}</p>
          </div>
        )}

        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={handleSave} disabled={saving || generating} className="px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
          {(form.status === "Planned" || form.status === "Brief Ready") && !generating && !generateResult && (
            <button onClick={handleGenerate} disabled={saving} className="px-4 py-2.5 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 disabled:opacity-50">
              Generate Draft
            </button>
          )}
          {form.status !== "Published" && !generating && (
            <button onClick={handleMarkPublished} disabled={saving} className="px-4 py-2.5 rounded-full border border-emerald-200 text-emerald-700 font-medium text-sm hover:bg-emerald-50 disabled:opacity-50">
              Mark Published
            </button>
          )}
          <button onClick={onClose} disabled={generating} className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 ml-auto disabled:opacity-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

interface BulkResult {
  id: number;
  title: string;
  status: "pending" | "running" | "done" | "error";
  slug?: string;
  blogPostId?: number;
  error?: string;
}

function BulkGenerateModal({ items, onClose }: { items: ContentPlanItem[]; onClose: () => void }) {
  const [results, setResults] = useState<BulkResult[]>(
    items.map((i) => ({ id: i.id, title: i.title, status: "pending" as const }))
  );
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const completed = results.filter((r) => r.status === "done").length;
  const errors = results.filter((r) => r.status === "error").length;
  const progress = results.length > 0 ? Math.round(((completed + errors) / results.length) * 100) : 0;

  async function runAll() {
    setRunning(true);
    for (let i = 0; i < results.length; i++) {
      setResults((prev) => prev.map((r, j) => j === i ? { ...r, status: "running" } : r));
      try {
        const res = await fetch("/api/admin/content/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId: results[i].id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setResults((prev) => prev.map((r, j) => j === i ? { ...r, status: "done", slug: data.slug, blogPostId: data.blogPostId } : r));
      } catch (err) {
        setResults((prev) => prev.map((r, j) => j === i ? { ...r, status: "error", error: err instanceof Error ? err.message : "Failed" } : r));
      }
    }
    setRunning(false);
    setDone(true);
  }

  async function publishAll() {
    setPublishing(true);
    const doneResults = results.filter((r) => r.status === "done" && r.blogPostId);
    for (const r of doneResults) {
      await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", id: r.blogPostId }),
      }).catch(() => {});
    }
    setPublishing(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg max-h-[80vh] overflow-y-auto m-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Bulk Generate</h2>
          <button onClick={onClose} disabled={running} className="text-slate-400 hover:text-slate-600 text-xl disabled:opacity-50">&times;</button>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          {results.length} article{results.length !== 1 ? "s" : ""} selected. Articles will be generated sequentially.
        </p>

        {/* Progress bar */}
        {(running || done) && (
          <div className="mb-4">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{completed + errors} of {results.length} — {completed} done, {errors} failed</p>
          </div>
        )}

        {/* Article list */}
        <div className="divide-y divide-slate-100 mb-4 max-h-60 overflow-y-auto">
          {results.map((r) => (
            <div key={r.id} className="flex items-center gap-3 py-2">
              {r.status === "pending" && <span className="w-5 h-5 rounded-full bg-slate-100 shrink-0" />}
              {r.status === "running" && <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin shrink-0" />}
              {r.status === "done" && <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0">&#10003;</span>}
              {r.status === "error" && <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs shrink-0">&#10007;</span>}
              <span className={`text-sm truncate ${r.status === "error" ? "text-red-600" : "text-slate-700"}`}>
                {r.title}
              </span>
              {r.status === "done" && r.blogPostId && (
                <a href={`/admin/blog/edit?id=${r.blogPostId}`} className="ml-auto text-xs text-violet-600 hover:underline shrink-0">View</a>
              )}
              {r.status === "error" && (
                <span className="ml-auto text-xs text-red-500 truncate max-w-[120px]" title={r.error}>{r.error}</span>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          {!running && !done && (
            <button onClick={runAll} className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700">
              Start Generating
            </button>
          )}
          {done && completed > 0 && (
            <>
              <button
                onClick={publishAll}
                disabled={publishing}
                className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                {publishing ? "Publishing..." : `Publish All (${completed})`}
              </button>
              <button onClick={onClose} className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50">
                Review one by one
              </button>
            </>
          )}
          {!running && !done && (
            <button onClick={onClose} className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50">
              Cancel
            </button>
          )}
          {done && completed === 0 && (
            <button onClick={onClose} className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
