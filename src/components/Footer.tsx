import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg leading-none">S</span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Supportive
              </h3>
            </div>
            <p className="text-slate-400 text-sm max-w-xs">
              Mental health and supportive services careers, Australia-wide.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-widest">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/roles" className="hover:text-violet-400 transition-colors">Role types</Link></li>
              <li><Link href="/locations" className="hover:text-violet-400 transition-colors">Locations</Link></li>
              <li><Link href="/specialties" className="hover:text-violet-400 transition-colors">Specialisations</Link></li>
              <li><Link href="/employers" className="hover:text-violet-400 transition-colors">Employers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-widest">Candidates</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-violet-400 transition-colors">Browse roles</Link></li>
              <li><Link href="/auth/register" className="hover:text-violet-400 transition-colors">Create account</Link></li>
              <li><Link href="/blog" className="hover:text-violet-400 transition-colors">Career blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-widest">Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/register" className="hover:text-violet-400 transition-colors">Post a role</Link></li>
              <li><Link href="/auth/login" className="hover:text-violet-400 transition-colors">Sign in</Link></li>
              <li><Link href="/about" className="hover:text-violet-400 transition-colors">About us</Link></li>
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
