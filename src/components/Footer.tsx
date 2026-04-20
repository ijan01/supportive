import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Supportive</h3>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Mental health and supportive services careers, Australia-wide.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/roles" className="hover:text-white transition-colors">Role types</Link></li>
              <li><Link href="/locations" className="hover:text-white transition-colors">Locations</Link></li>
              <li><Link href="/specialties" className="hover:text-white transition-colors">Specialisations</Link></li>
              <li><Link href="/employers" className="hover:text-white transition-colors">Employers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Candidates</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Browse roles</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Create account</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Career blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Employers</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Post a role</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign in</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-10 pt-8 space-y-2 text-center text-sm text-slate-500">
          <p>Jobs aggregated from Adzuna and direct employer feeds. Apply links go to the original posting source.</p>
          <p>
            Powered by{" "}
            <a href="https://www.adzuna.com.au" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              Adzuna
            </a>
          </p>
          <p>&copy; {new Date().getFullYear()} Supportive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
