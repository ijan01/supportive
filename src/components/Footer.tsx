import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg leading-none">S</span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Supportive
              </h3>
            </div>
            <p className="text-slate-400 text-sm">
              Mental health and supportive services careers, Australia-wide.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-violet-400 transition-colors">Browse Jobs</Link></li>
              <li><Link href="/auth/register" className="hover:text-violet-400 transition-colors">Create Account</Link></li>
              <li><Link href="/blog" className="hover:text-violet-400 transition-colors">Career Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/register" className="hover:text-violet-400 transition-colors">Post a Job</Link></li>
              <li><Link href="/auth/login" className="hover:text-violet-400 transition-colors">Employer Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-violet-400 transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-violet-400 transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Supportive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
