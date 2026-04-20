import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About us",
  description: "Supportive is Australia's job directory for mental health and supportive services roles.",
};

export default function AboutPage() {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            About <span className="text-highlight">Supportive</span>
          </h1>
          <p className="text-xl text-slate-500">A job directory built for the mental health sector</p>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <p className="text-slate-600 text-lg leading-relaxed">
              Supportive is an Australian job directory for mental health and supportive services roles.
              We exist to make it easier for clinicians, peer workers, allied health professionals, and
              community services staff to find roles with organisations that share their values.
            </p>
          </div>

          <div className="bg-lavender rounded-2xl p-8 sm:p-10">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Our mission</h2>
            <p className="text-slate-600 leading-relaxed">
              The mental health workforce is under pressure. Finding mission-aligned roles in a sector
              that matters shouldn&apos;t require trawling through generic job boards full of unrelated listings.
              Supportive keeps the focus where it belongs — on clinical, community, NDIS, and AOD roles
              across Australia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-3">For candidates</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Browse roles across 18 specialised categories — from Psychologist and Mental Health Nurse
                through to Peer Support Worker, AOD Worker, and Case Manager. Save roles, track applications,
                and find opportunities posted by organisations you&apos;d actually want to work for.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-3">For employers</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Post roles directly to an audience of mental health professionals. No irrelevant traffic —
                every visitor to Supportive is here because they work in or are looking to enter the mental
                health and supportive services sector.
              </p>
            </div>
          </div>

          <div className="bg-violet-600 rounded-3xl p-10 sm:p-14 text-white text-center">
            <h3 className="text-2xl font-extrabold mb-3">Ready to get started?</h3>
            <p className="text-violet-100 mb-8">Browse roles or post a position on Supportive today.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/jobs" className="px-8 py-3.5 rounded-full bg-white text-violet-600 font-semibold hover:bg-violet-50 transition-all">
                Browse roles
              </Link>
              <Link href="/auth/register" className="px-8 py-3.5 rounded-full border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-all">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
