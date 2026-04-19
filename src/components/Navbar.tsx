"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session?.user as { role?: string } | undefined;
  const dashboardPath = user?.role === "company" ? "/dashboard/company" : "/dashboard/seeker";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg leading-none">S</span>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Supportive</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-slate-600 hover:text-violet-600 font-medium transition-colors">
              Browse roles
            </Link>
            <Link href="/roles" className="text-slate-600 hover:text-violet-600 font-medium transition-colors">
              Role types
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-violet-600 font-medium transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-violet-600 font-medium transition-colors">
              About
            </Link>
            {session ? (
              <>
                <Link href={dashboardPath} className="text-slate-600 hover:text-violet-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-slate-600 hover:text-violet-600 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-slate-600 hover:text-violet-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
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

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/jobs" className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
              Browse roles
            </Link>
            <Link href="/roles" className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
              Role types
            </Link>
            <Link href="/blog" className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            {session ? (
              <>
                <Link href={dashboardPath} className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-600 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth/register" className="block px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-center font-medium" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
