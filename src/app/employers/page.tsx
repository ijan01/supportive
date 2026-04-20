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
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-600 text-sm font-medium mb-6">
            For employers
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
            Hire the people who{" "}
            <span className="text-highlight">make a difference</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
            Supportive is built for mental health, AOD, NDIS, and community services employers. Reach candidates who are specifically looking for roles like yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all"
            >
              Post a role — it&apos;s free
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3.5 rounded-full border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Why Supportive */}
      <section className="py-20 bg-lavender">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-violet-200 bg-white text-violet-600 text-sm font-medium mb-4">
              Why Supportive
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Why post on <span className="text-highlight">Supportive?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                heading: "Purpose-built taxonomy",
                body: "Roles are categorised using the actual job titles used in the sector — psychologist, peer support worker, AOD counsellor, mental health nurse — not generic buckets.",
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
              <div key={heading} className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{heading}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-600 text-sm font-medium mb-4">
              How it works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Get started in <span className="text-highlight">three steps</span>
            </h2>
          </div>
          <ol className="space-y-8">
            {[
              { step: "01", heading: "Create an employer account", body: "Register with your work email and organisation name. Takes about 60 seconds." },
              { step: "02", heading: "Post your role", body: "Fill in the title, location, salary range, and description. Add an external apply URL or let candidates apply directly through Supportive." },
              { step: "03", heading: "Review applications", body: "Applications appear in your employer dashboard as they come in. Shortlist, review, and contact candidates from one place." },
            ].map(({ step, heading, body }) => (
              <li key={step} className="flex gap-5">
                <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 font-bold flex items-center justify-center shrink-0 text-sm">
                  {step}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{heading}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What roles fit */}
      <section className="py-20 bg-lavender">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">What kinds of roles belong here?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Supportive is for organisations operating in the mental health and community services sector — from large public health providers to small NDIS sole traders.
            </p>
          </div>
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
              <div key={role} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-violet-600 rounded-3xl p-10 sm:p-14 text-white text-center">
            <h2 className="text-3xl font-extrabold mb-4">Ready to post your first role?</h2>
            <p className="text-violet-100 text-lg mb-8">Create a free employer account and be live in minutes.</p>
            <Link
              href="/auth/register"
              className="inline-block px-8 py-3.5 rounded-full bg-white text-violet-600 font-semibold hover:bg-violet-50 transition-all"
            >
              Create employer account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
