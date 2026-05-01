"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CONTENT_MODELS, type ModelBadge } from "@/constants/content-models";

interface Props {
  initialModelId: string;
  initialSystemPrompt: string;
  defaultSystemPrompt: string;
}

const BADGE_STYLES: Record<ModelBadge, string> = {
  FAST:    "bg-amber-100 text-amber-700",
  DEFAULT: "bg-violet-100 text-violet-700",
  BEST:    "bg-blue-100 text-blue-700",
};

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function AgentSettingsClient({ initialModelId, initialSystemPrompt, defaultSystemPrompt }: Props) {
  const [modelId, setModelId] = useState(initialModelId);
  const [pendingModelId, setPendingModelId] = useState(initialModelId);
  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
  const [savedPrompt, setSavedPrompt] = useState(initialSystemPrompt);
  const [modelStatus, setModelStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [promptStatus, setPromptStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [, startTransition] = useTransition();

  const anthropicModels = CONTENT_MODELS.filter((m) => m.provider === "anthropic");
  const googleModels    = CONTENT_MODELS.filter((m) => m.provider === "google");
  const deepseekModels  = CONTENT_MODELS.filter((m) => m.provider === "deepseek");

  async function saveModel() {
    setModelStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/agent-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_id: pendingModelId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(data.error || `Save failed (${res.status})`);
      }
      setModelId(pendingModelId);
      setModelStatus("saved");
      setTimeout(() => setModelStatus("idle"), 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Save failed");
      setModelStatus("error");
      setTimeout(() => setModelStatus("idle"), 5000);
    }
  }

  async function savePrompt() {
    setPromptStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/agent-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system_prompt: systemPrompt }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(data.error || `Save failed (${res.status})`);
      }
      setSavedPrompt(systemPrompt);
      setPromptStatus("saved");
      setTimeout(() => setPromptStatus("idle"), 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Save failed");
      setPromptStatus("error");
      setTimeout(() => setPromptStatus("idle"), 5000);
    }
  }

  function resetPrompt() {
    startTransition(() => setSystemPrompt(defaultSystemPrompt));
  }

  const promptDirty = systemPrompt !== savedPrompt;
  const modelDirty  = pendingModelId !== modelId;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-2">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-violet-600 transition-colors">← Admin</Link>
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Content Agent</h1>
      <p className="text-sm text-slate-500 mb-8">
        The system prompt guides every article the AI writes. Edit it to change tone, structure, or focus.{" "}
        <span className="text-violet-600">Changes take effect on the next generation run.</span>
      </p>

      {/* Model picker */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">Language model</h2>
        <p className="text-sm text-slate-500 mb-5">Model used for article generation and social content pack creation.</p>

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Anthropic</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {anthropicModels.map((m) => (
            <label
              key={m.id}
              className={`relative flex flex-col gap-1 border rounded-xl p-4 cursor-pointer transition-all ${
                pendingModelId === m.id
                  ? "border-violet-500 bg-violet-50 shadow-sm"
                  : "border-slate-200 hover:border-violet-200"
              }`}
            >
              <input
                type="radio"
                name="model"
                value={m.id}
                checked={pendingModelId === m.id}
                onChange={() => setPendingModelId(m.id)}
                className="absolute top-3 right-3 accent-violet-600"
              />
              <span className="text-sm font-semibold text-slate-800 pr-5">{m.name}</span>
              <span className={`self-start text-xs font-semibold px-1.5 py-0.5 rounded ${BADGE_STYLES[m.badge]}`}>
                {m.badge}
              </span>
              <span className="text-xs text-slate-400">{m.description}</span>
            </label>
          ))}
        </div>

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Google</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {googleModels.map((m) => (
            <label
              key={m.id}
              className={`relative flex flex-col gap-1 border rounded-xl p-4 cursor-pointer transition-all ${
                pendingModelId === m.id
                  ? "border-violet-500 bg-violet-50 shadow-sm"
                  : "border-slate-200 hover:border-violet-200"
              }`}
            >
              <input
                type="radio"
                name="model"
                value={m.id}
                checked={pendingModelId === m.id}
                onChange={() => setPendingModelId(m.id)}
                className="absolute top-3 right-3 accent-violet-600"
              />
              <span className="text-sm font-semibold text-slate-800 pr-5">{m.name}</span>
              <span className={`self-start text-xs font-semibold px-1.5 py-0.5 rounded ${BADGE_STYLES[m.badge]}`}>
                {m.badge}
              </span>
              <span className="text-xs text-slate-400">{m.description}</span>
            </label>
          ))}
        </div>

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">DeepSeek</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {deepseekModels.map((m) => (
            <label
              key={m.id}
              className={`relative flex flex-col gap-1 border rounded-xl p-4 cursor-pointer transition-all ${
                pendingModelId === m.id
                  ? "border-violet-500 bg-violet-50 shadow-sm"
                  : "border-slate-200 hover:border-violet-200"
              }`}
            >
              <input
                type="radio"
                name="model"
                value={m.id}
                checked={pendingModelId === m.id}
                onChange={() => setPendingModelId(m.id)}
                className="absolute top-3 right-3 accent-violet-600"
              />
              <span className="text-sm font-semibold text-slate-800 pr-5">{m.name}</span>
              <span className={`self-start text-xs font-semibold px-1.5 py-0.5 rounded ${BADGE_STYLES[m.badge]}`}>
                {m.badge}
              </span>
              <span className="text-xs text-slate-400">{m.description}</span>
            </label>
          ))}
        </div>

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Coming soon</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col gap-1 border border-dashed border-slate-200 rounded-xl p-4 opacity-50 cursor-not-allowed">
            <span className="text-sm font-semibold text-slate-500">OpenAI GPT</span>
            <span className="text-xs text-slate-400">Coming soon</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={saveModel}
            disabled={!modelDirty || modelStatus === "saving"}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {modelStatus === "saving" ? "Saving…" : modelStatus === "saved" ? "Saved ✓" : modelStatus === "error" ? "Failed" : "Save model"}
          </button>
          {modelStatus === "error" && errorMsg && (
            <span className="text-xs text-red-600">{errorMsg}</span>
          )}
        </div>
      </div>

      {/* System prompt editor */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-slate-900">System prompt</h2>
          <span className="text-xs text-slate-400">{wordCount(systemPrompt).toLocaleString()} words</span>
        </div>
        <p className="text-sm text-slate-500 mb-4">This prompt is injected as the AI&apos;s instructions before every article brief.</p>

        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={22}
          className="w-full text-sm font-mono text-slate-700 border border-slate-200 rounded-xl p-4 resize-y focus:outline-none focus:ring-2 focus:ring-violet-300 leading-relaxed"
          spellCheck={false}
        />

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={resetPrompt}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-all"
          >
            Reset to default
          </button>
          <button
            onClick={savePrompt}
            disabled={!promptDirty || promptStatus === "saving"}
            className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {promptStatus === "saving" ? "Saving…" : promptStatus === "saved" ? "Saved ✓" : promptStatus === "error" ? "Failed" : "Save prompt"}
          </button>
          {promptDirty && promptStatus === "idle" && (
            <span className="text-xs text-amber-600">Unsaved changes</span>
          )}
          {promptStatus === "error" && errorMsg && (
            <span className="text-xs text-red-600">{errorMsg}</span>
          )}
        </div>
      </div>
    </div>
  );
}
