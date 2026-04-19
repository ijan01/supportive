import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About us",
  description: "Supportive is Australia's job directory for mental health and supportive services roles.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
          About Supportive
        </h1>
        <p className="text-xl text-slate-500">A job directory built for the mental health sector</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>
          Supportive is an Australian job directory for mental health and supportive services roles.
          We exist to make it easier for clinicians, peer workers, allied health professionals, and
          community services staff to find roles with organisations that share their values.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">Our mission</h2>
        <p>
          The mental health workforce is under pressure. Finding mission-aligned roles in a sector
          that matters shouldn&apos;t require trawling through generic job boards full of unrelated listings.
          Supportive keeps the focus where it belongs — on clinical, community, NDIS, and AOD roles
          across Australia.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">For candidates</h2>
        <p>
          Browse roles across 18 specialised categories — from Psychologist and Mental Health Nurse
          through to Peer Support Worker, AOD Worker, and Case Manager. Save roles, track applications,
          and find opportunities posted by organisations you&apos;d actually want to work for.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">For employers</h2>
        <p>
          Post roles directly to an audience of mental health professionals. No irrelevant traffic —
          every visitor to Supportive is here because they work in or are looking to enter the mental
          health and supportive services sector.
        </p>
      </div>

      <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
        <p className="text-purple-100 mb-6">Browse roles or post a position on Supportive today.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/jobs" className="px-6 py-3 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition-all">
            Browse jobs
          </Link>
          <Link href="/auth/register" className="px-6 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
