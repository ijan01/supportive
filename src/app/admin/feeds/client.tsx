"use client";

import { useState } from "react";
import Link from "next/link";

interface RunResult {
  ok?: boolean;
  dryRun?: boolean;
  stats?: {
    totalFetched: number;
    totalDeduped: number;
    totalFiltered: number;
    totalClassified: number;
    totalPublished: number;
    totalQueued: number;
    totalRejected: number;
    errors?: string[];
  };
  error?: string;
}

export default function RunNowClient() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);

  async function handleRun(dryRun: boolean) {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch(`/api/cron/ingest-adzuna?dry=${dryRun ? "1" : "0"}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Manual run</h2>
        <div className="flex gap-3">
          <button
            onClick={() => handleRun(true)}
            disabled={running}
            className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {running ? "Running..." : "Dry run"}
          </button>
          <button
            onClick={() => handleRun(false)}
            disabled={running}
            className="px-6 py-2.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-50"
          >
            {running ? "Running..." : "Run now (live)"}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Dry run logs results without writing to the database. Live run fetches, classifies, and stores jobs.
        </p>
      </div>

      {result && (
        <div className={`rounded-xl border p-6 ${result.error ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
          <h3 className="font-semibold text-slate-900 mb-3">
            {result.error ? "Run failed" : `Run complete${result.dryRun ? " (dry run)" : ""}`}
          </h3>
          {result.error && (
            <p className="text-red-700 text-sm">{result.error}</p>
          )}
          {result.stats && (
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Fetched</dt>
                <dd className="font-semibold text-slate-900">{result.stats.totalFetched}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Deduped</dt>
                <dd className="font-semibold text-slate-900">{result.stats.totalDeduped}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Filtered</dt>
                <dd className="font-semibold text-slate-900">{result.stats.totalFiltered}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Classified</dt>
                <dd className="font-semibold text-slate-900">{result.stats.totalClassified}</dd>
              </div>
              <div>
                <dt className="text-green-700">Published</dt>
                <dd className="font-semibold text-green-700">{result.stats.totalPublished}</dd>
              </div>
              <div>
                <dt className="text-amber-700">Queued</dt>
                <dd className="font-semibold text-amber-700">{result.stats.totalQueued}</dd>
              </div>
              <div>
                <dt className="text-red-700">Rejected</dt>
                <dd className="font-semibold text-red-700">{result.stats.totalRejected}</dd>
              </div>
            </dl>
          )}
          {result.stats?.errors && result.stats.errors.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm font-medium text-red-800 mb-1">
                {result.stats.errors.length} query error{result.stats.errors.length !== 1 ? "s" : ""}:
              </p>
              <ul className="text-xs text-red-700 space-y-1">
                {result.stats.errors.slice(0, 5).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
                {result.stats.errors.length > 5 && (
                  <li>...and {result.stats.errors.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 text-sm">
        <Link href="/admin/feed-runs" className="text-violet-600 hover:text-violet-700 font-medium">
          View run history →
        </Link>
        <Link href="/admin/review-queue" className="text-violet-600 hover:text-violet-700 font-medium">
          Review queue →
        </Link>
      </div>
    </div>
  );
}
