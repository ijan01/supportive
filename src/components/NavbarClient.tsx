"use client";

import Link from "next/link";
import { useState } from "react";

interface NavbarUser {
  role: string;
}

export default function NavbarClient({ user }: { user: NavbarUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const dashboardPath = isAdmin ? "/admin" : user?.role === "company" ? "/dashboard/company" : "/dashboard/seeker";

  async function handleSignOut() {
    document.cookie = "authjs.session-token=; path=/; max-age=0";
    document.cookie = "__Secure-authjs.session-token=; path=/; max-age=0; secure";
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Supportive
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/jobs" className="px-3 py-2 rounded-lg text-slate-600 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all text-sm">
              Browse roles
            </Link>
            <Link href="/roles" className="px-3 py-2 rounded-lg text-slate-600 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all text-sm">
              Role types
            </Link>
            <Link href="/employers" className="px-3 py-2 rounded-lg text-slate-600 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all text-sm">
              Employers
            </Link>
            <Link href="/about" className="px-3 py-2 rounded-lg text-slate-600 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all text-sm">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href={dashboardPath} className="px-4 py-2 rounded-lg text-slate-600 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all text-sm">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 rounded-lg text-slate-600 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all text-sm">
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-slate-100">
            <Link href="/jobs" className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
              Browse roles
            </Link>
            <Link href="/roles" className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
              Role types
            </Link>
            <Link href="/employers" className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
              Employers
            </Link>
            <Link href="/about" className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <div className="border-t border-slate-100 pt-2 mt-2">
              {user ? (
                <>
                  <Link href={dashboardPath} className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
                    Sign in
                  </Link>
                  <Link href="/auth/register" className="block mx-4 mt-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-center font-medium" onClick={() => setMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
