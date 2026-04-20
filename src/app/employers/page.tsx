import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Post mental health jobs — Supportive for employers",
  description: "Reach mission-aligned candidates across clinical, allied health, AOD, peer work, NDIS, and community services. Free to list on Supportive.",
  alternates: { canonical: "/employers" },
};

export default function EmployersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest mb-4">For employers</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Hire the people who{" "}
            <span className="text-amber-300">make a difference</span>
          </h1>
          <p className="text-purple-100 text-lg mb-10 max-w-2xl mx-auto">
            Supportive is built for mental health, AOD, NDIS, and community services employers. Reach candidates who are specifically looking for roles like yours — not sifting through generic job boards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition-all shadow-lg"
            >
              Post a role — it&apos;s free
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3.5 rounded-full border-2 border-white/60 text-white font-semibold hover:bg-white/10 transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Why Supportive */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Why post on Supportive?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                heading: "Purpose-built taxonomy",
                body: "Roles are categorised using the actual job titles used in the sector — psychologist, peer support worker, AOD counsellor, mental health nurse — not generic software developer buckets.",
              },
              {
                heading: "Candidates already here for this",
                body: "Everyone browsing Supportive is looking for a role in mental health or community services. No wading through applications from people who just saw a generic ad.",
              },
              {
                heading: "Free to list",
                body: "Posting is free during our launch phase. Create an account, fill in the form, and your role goes live immediately — no approval queue for employer-posted roles.",
              },
            ].map(({ heading, body }) => (
              <div key={heading} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-2">{heading}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">How it works</h2>
          <ol className="space-y-8">
            {[
              { step: "1", heading: "Create an employer account", body: "Register with your work email and organisation name. Takes about 60 seconds." },
              { step: "2", heading: "Post your role", body: "Fill in the title, location, salary range, and description. Add an external apply URL or let candidates apply directly through Supportive." },
              { step: "3", heading: "Review applications", body: "Applications appear in your employer dashboard as they come in. Shortlist, review, and contact candidates from one place." },
            ].map(({ step, heading, body }) => (
              <li key={step} className="flex gap-5">
                <div className="w-9 h-9 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{heading}</h3>
                  <p className="text-slate-500 text-sm">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What roles fit */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">What kinds of roles belong here?</h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">
            Supportive is for organisations operating in the mental health and community services sector — from large public health providers to small NDIS sole traders.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-slate-700">
            {[
              "Psychologists & clinical psychologists",
              "Psychiatrists",
              "Mental health nurses",
              "Social workers",
              "Counsellors & psychotherapists",
              "AOD & addiction workers",
              "Peer support workers",
              "NDIS support workers",
              "Youth mental health workers",
              "Occupational therapists (MH)",
              "Case managers",
              "Team leaders & clinical leads",
            ].map((role) => (
              <div key={role} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to post your first role?</h2>
          <p className="text-purple-100 mb-8">Create a free employer account and be live in minutes.</p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-3.5 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition-all shadow-lg"
          >
            Create employer account
          </Link>
        </div>
      </section>
    </>
  );
}
