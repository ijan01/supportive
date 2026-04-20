"use client";

import { useState } from "react";
import ApplyModal from "@/components/ApplyModal";
import SaveJobButton from "@/components/SaveJobButton";

export default function JobDetailClient({ jobId, jobTitle, userRole }: { jobId: number; jobTitle: string; userRole: string | null }) {
  const [showApply, setShowApply] = useState(false);

  const isSeeker = userRole === "seeker";
  const isLoggedIn = userRole !== null;

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {isLoggedIn && isSeeker && (
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
      {!isLoggedIn && (
        <a
          href={`/auth/login?callbackUrl=/jobs/${jobId}`}
          className="px-6 py-2.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all"
        >
          Sign in to Apply
        </a>
      )}
    </div>
  );
}
