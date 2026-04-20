import Link from "next/link";
import { getAllUsers } from "@/lib/admin";
import AdminUserActions from "./client";

export const dynamic = "force-dynamic";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700",
  company: "bg-blue-100 text-blue-700",
  seeker: "bg-slate-100 text-slate-600",
};

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin" className="text-sm text-violet-600 hover:text-violet-700 font-medium">Admin</Link>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Users ({users.length})</h1>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Jobs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Joined</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] || "bg-slate-100 text-slate-600"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.company_name || "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{user.job_count}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(user.created_at).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3">
                    <AdminUserActions userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
