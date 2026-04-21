"use client";

import { useState } from "react";
import ApplyModal from "@/components/ApplyModal";
import SaveJobButton from "@/components/SaveJobButton";

interface Props {
  jobId: number;
  jobTitle: string;
  jobCompany: string;
  userRole: string | null;
  applyMethod: "external" | "internal";
  applyUrl: string | null;
}

export default function JobDetailClient({ jobId, jobTitle, jobCompany, userRole, applyMethod, applyUrl }: Props) {
  const [showApply, setShowApply] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ahpra, setAhpra] = useState("");
  const [coverNote, setCoverNote] = useState("");

  const isSeeker = userRole === "seeker";
  const isLoggedIn = userRole !== null;
  const isInternal = applyMethod === "internal";

  async function handleInlineSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          name,
          email,
          phone: phone || undefined,
          ahpra_number: ahpra || undefined,
          cover_letter: coverNote || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  }

  // Word count for cover note
  const wordCount = coverNote.trim() ? coverNote.trim().split(/\s+/).length : 0;

  return (
    <div className="mb-8">
      {/* Action buttons row */}
      <div className="flex flex-wrap gap-3 mb-6">
        {isLoggedIn && isSeeker && !isInternal && (
          <>
            <button
              onClick={() => setShowApply(true)}
              className="px-6 py-2.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all"
            >
              Apply Now
            </button>
            <SaveJobButton jobId={jobId} initialSaved={false} />
            <ApplyModal jobId={jobId} jobTitle={jobTitle} isOpen={showApply} onClose={() => setShowApply(false)} />
          </>
        )}

        {isLoggedIn && isSeeker && isInternal && !showInlineForm && !submitted && (
          <>
            <button
              onClick={() => setShowInlineForm(true)}
              className="px-6 py-2.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all"
            >
              Apply Now
            </button>
            <SaveJobButton jobId={jobId} initialSaved={false} />
          </>
        )}

        {!isLoggedIn && (
          <a
            href={`/auth/login?callbackUrl=/jobs/${jobId}`}
            className="px-6 py-2.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all"
          >
            Sign in to Apply
          </a>
        )}

        {isLoggedIn && !isSeeker && applyUrl && (
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all"
          >
            View Application
          </a>
        )}
      </div>

      {/* Submitted success */}
      {submitted && (
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="text-3xl mb-2">&#10003;</div>
          <h3 className="text-lg font-bold text-emerald-800 mb-1">Application submitted</h3>
          <p className="text-emerald-700 text-sm">Your application for <strong>{jobTitle}</strong> at <strong>{jobCompany}</strong> has been received. Good luck!</p>
        </div>
      )}

      {/* Inline application form for internal apply */}
      {showInlineForm && !submitted && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Apply for this role</h3>
          <p className="text-slate-500 text-sm mb-6">Your application goes directly to {jobCompany} through Supportive.</p>

          {formError && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{formError}</div>}

          <form onSubmit={handleInlineSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="04xx xxx xxx" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">AHPRA number <span className="text-slate-400 font-normal">(optional)</span></label>
                <input type="text" value={ahpra} onChange={(e) => setAhpra(e.target.value)} placeholder="e.g. PSY0001234567" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                <p className="text-xs text-slate-400 mt-1">Required for AHPRA-registered roles. Your number can be verified at <a href="https://www.ahpra.gov.au/Registration/Registers-of-Practitioners.aspx" target="_blank" rel="noopener noreferrer" className="underline">ahpra.gov.au</a></p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover note <span className="text-slate-400 font-normal">(optional, max 500 words)</span></label>
              <textarea
                rows={5}
                value={coverNote}
                onChange={(e) => { if (e.target.value.trim().split(/\s+/).length <= 500 || e.target.value.length < coverNote.length) setCoverNote(e.target.value); }}
                placeholder="Tell the employer why you're a good fit for this role..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y text-sm"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{wordCount} / 500 words</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={formLoading} className="px-8 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all disabled:opacity-50">
                {formLoading ? "Submitting..." : "Submit application"}
              </button>
              <button type="button" onClick={() => setShowInlineForm(false)} className="px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
