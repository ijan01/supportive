import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import RunNowClient from "./client";

export const dynamic = "force-dynamic";

export default async function FeedsAdminPage() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "company") redirect("/auth/login");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Feed management</h1>
        <p className="text-slate-500 text-sm mt-1">
          Adzuna feed runs daily at 04:00 AEDT. Use the button below for a manual run.
        </p>
      </div>

      <RunNowClient />
    </div>
  );
}
