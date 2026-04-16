"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ApplyModal from "@/components/ApplyModal";
import SaveJobButton from "@/components/SaveJobButton";

export default function JobDetailClient({ jobId, jobTitle }: { jobId: number; jobTitle: string }) {
  const { data: session } = useSession();
  const [showApply, setShowApply] = useState(false);

  const user = session?.user as { role?: string } | undefined;
  const isSeeker = user?.role === "seeker";

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {session && isSeeker && (
        <>
          <button
            onClick={() => setShowApply(true)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md"
          >
            Apply Now
          </button>
          <SaveJobButton jobId={jobId} initialSaved={false} />
          <ApplyModal jobId={jobId} jobTitle={jobTitle} isOpen={showApply} onClose={() => setShowApply(false)} />
        </>
      )}
      {!session && (
        <a
          href="/auth/login"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md"
        >
          Sign in to Apply
        </a>
      )}
    </div>
  );
}
