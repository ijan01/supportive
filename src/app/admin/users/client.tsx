"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminUserActions({ userId, currentRole }: { userId: number; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function changeRole(newRole: string) {
    if (newRole === currentRole) return;
    if (newRole === "admin" && !confirm("Promote this user to admin?")) return;
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <select
      value={currentRole}
      onChange={(e) => changeRole(e.target.value)}
      disabled={loading}
      className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
    >
      <option value="seeker">Seeker</option>
      <option value="company">Company</option>
      <option value="admin">Admin</option>
    </select>
  );
}
