import Link from "next/link";
import { getCompanies } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin" className="text-sm text-violet-600 hover:text-violet-700 font-medium">Admin</Link>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Companies ({companies.length})</h1>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Jobs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Applications</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.company_name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500">{c.email}</td>
                  <td className="px-4 py-3">
                    {c.job_count > 0 ? (
                      <Link href={`/admin/jobs?search=${encodeURIComponent(c.company_name || c.name)}`} className="text-violet-600 font-medium hover:text-violet-700">
                        {c.job_count}
                      </Link>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.application_count}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(c.created_at).toLocaleDateString("en-AU")}
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No company accounts yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
