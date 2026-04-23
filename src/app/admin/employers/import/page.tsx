import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import ImportClient from "./client";

export const dynamic = "force-dynamic";

export default async function ImportEmployersPage() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") redirect("/auth/login");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Import employers</h1>
        <p className="text-slate-500 text-sm mt-1">
          Paste JSON data to bulk-create employer profiles. Max 200 per batch.
        </p>
      </div>
      <ImportClient />
    </div>
  );
}
