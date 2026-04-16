"use client";

import { useState } from "react";

interface ApplyModalProps {
  jobId: number;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyModal({ jobId, jobTitle, isOpen, onClose }: ApplyModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, name, email, resume_url: resumeUrl, cover_letter: coverLetter }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
            <p className="text-slate-500 mb-6">Your application for {jobTitle} has been sent.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium">
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Apply for this job</h3>
            <p className="text-slate-500 text-sm mb-6">{jobTitle}</p>
            {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resume URL</label>
                <input type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter</label>
                <textarea rows={4} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50">
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
