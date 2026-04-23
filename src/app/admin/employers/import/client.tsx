"use client";

import { useState } from "react";
import Link from "next/link";
import { ORGANISATION_TYPES, EMPLOYER_BENEFITS } from "@/constants";

interface ImportResult {
  total: number;
  created: number;
  skipped: number;
  errors: string[];
}

const EXAMPLE = JSON.stringify(
  [
    {
      name: "Mindful Health Clinic",
      email: "admin@mindfulhealth.com.au",
      website: "https://mindfulhealth.com.au",
      organisation_type: "private-practice",
      description: "A private psychology practice specialising in anxiety and mood disorders.",
      benefits: ["flexible-working", "professional-development", "supervision-provided"],
    },
  ],
  null,
  2
);

export default function ImportClient() {
  const [input, setInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    setError(null);
    setResult(null);

    let parsed;
    try {
      parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) parsed = [parsed];
    } catch {
      setError("Invalid JSON. Check your formatting and try again.");
      return;
    }

    setImporting(true);
    try {
      const res = await fetch("/api/admin/employers/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employers: parsed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Import failed");
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">JSON data</h2>
        <p className="text-sm text-slate-500 mb-4">
          Paste a JSON array of employer objects. Each object needs at minimum a <code className="text-violet-600">name</code> field.
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={16}
          placeholder={EXAMPLE}
          className="w-full font-mono text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y"
        />
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleImport}
            disabled={importing || !input.trim()}
            className="px-6 py-2.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-50"
          >
            {importing ? "Importing..." : "Import"}
          </button>
          <button
            onClick={() => setInput(EXAMPLE)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
          >
            Load example
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-green-100 bg-green-50 p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Import complete</h3>
          <dl className="grid grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <dt className="text-slate-500">Total</dt>
              <dd className="font-semibold text-slate-900">{result.total}</dd>
            </div>
            <div>
              <dt className="text-green-700">Created</dt>
              <dd className="font-semibold text-green-700">{result.created}</dd>
            </div>
            <div>
              <dt className="text-amber-700">Skipped (duplicate slug)</dt>
              <dd className="font-semibold text-amber-700">{result.skipped}</dd>
            </div>
          </dl>
          {result.errors.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm font-medium text-red-800 mb-1">{result.errors.length} error(s):</p>
              <ul className="text-xs text-red-700 space-y-1">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
          <Link href="/admin/employers" className="text-violet-600 hover:text-violet-700 text-sm font-medium mt-4 inline-block">
            View all employers
          </Link>
        </div>
      )}

      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Field reference</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Fields</h4>
            <dl className="space-y-1.5 text-slate-600">
              <div><dt className="inline font-mono text-violet-600">name</dt> — Required</div>
              <div><dt className="inline font-mono text-slate-500">email</dt> — Login email (auto-generated if omitted)</div>
              <div><dt className="inline font-mono text-slate-500">website</dt> — URL</div>
              <div><dt className="inline font-mono text-slate-500">description</dt> — About the organisation</div>
              <div><dt className="inline font-mono text-slate-500">why_work_with_us</dt> — Selling points</div>
              <div><dt className="inline font-mono text-slate-500">organisation_type</dt> — See list below</div>
              <div><dt className="inline font-mono text-slate-500">benefits</dt> — Array of benefit slugs</div>
            </dl>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Organisation types</h4>
            <ul className="space-y-0.5 text-xs text-slate-500">
              {ORGANISATION_TYPES.map((t) => (
                <li key={t.value}><code>{t.value}</code> — {t.label}</li>
              ))}
            </ul>
            <h4 className="font-medium text-slate-700 mt-3 mb-2">Benefit slugs</h4>
            <ul className="space-y-0.5 text-xs text-slate-500">
              {EMPLOYER_BENEFITS.map((b) => (
                <li key={b.slug}><code>{b.slug}</code> — {b.label}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
