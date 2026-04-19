import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about JobBoard — our mission to connect talented professionals with companies building the future.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
          About JobBoard
        </h1>
        <p className="text-xl text-slate-500">Connecting talent with opportunity</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>
          JobBoard is a modern job search platform built to help professionals find meaningful work
          and help companies hire the right people. Whether you&apos;re searching for your next role
          or looking to grow your team, we&apos;re here to make the process simple, transparent, and effective.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">Our Mission</h2>
        <p>
          We believe work should be fulfilling. Our mission is to reduce friction in the hiring process
          by giving job seekers access to quality opportunities and providing companies with tools to
          attract the best candidates.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">For Job Seekers</h2>
        <p>
          Browse thousands of jobs from top companies, save roles you&apos;re interested in, and track
          your applications in one place. Our search and filter tools help you find exactly what you&apos;re
          looking for.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">For Companies</h2>
        <p>
          Post unlimited job listings, manage applications, and reach a global talent pool. Our SEO-optimized
          job pages help your listings rank in search engines, bringing qualified candidates to you.
        </p>
      </div>

      <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
        <p className="text-purple-100 mb-6">Join thousands of professionals on JobBoard today.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/jobs" className="px-6 py-3 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition-all">
            Browse Jobs
          </Link>
          <Link href="/auth/register" className="px-6 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
