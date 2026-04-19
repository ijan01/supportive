import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mental health employers in Australia",
  description: "Discover mission-aligned mental health and community services employers hiring on Supportive.",
  alternates: { canonical: "/employers" },
};

export default function EmployersIndexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Mental health employers</h1>

      <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-8">
        <p className="text-violet-700 font-medium mb-1">Coming soon — this hub is being built.</p>
        <p className="text-violet-600 text-sm">This page will list all organisations hiring on Supportive, with employer profiles, open roles, and culture notes.</p>
      </div>

      <p className="text-slate-500 text-sm mb-6">In the meantime, browse all current roles:</p>
      <Link href="/jobs" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all">
        Browse all roles →
      </Link>
    </div>
  );
}
