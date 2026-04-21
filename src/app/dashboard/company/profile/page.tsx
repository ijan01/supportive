import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getEmployerByUserId } from "@/lib/employers";
import EmployerProfileForm from "./client";

export const dynamic = "force-dynamic";

export default async function EmployerProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "company") redirect("/dashboard/seeker");

  const employer = await getEmployerByUserId(Number(session.user.id));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm mb-1">
        <Link href="/dashboard/company" className="text-violet-600 hover:text-violet-700 font-medium">Dashboard</Link>
        <span className="text-slate-300">&rsaquo;</span>
        <span className="text-slate-500">Profile</span>
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Organisation profile</h1>
      <EmployerProfileForm
        initial={employer ? {
          name: employer.name,
          website: employer.website || "",
          description: employer.description || "",
          why_work_with_us: employer.why_work_with_us || "",
          organisation_type: employer.organisation_type || "",
          benefits: employer.benefits,
          logo_url: employer.logo_url || "",
        } : {
          name: session.user.companyName || "",
          website: "",
          description: "",
          why_work_with_us: "",
          organisation_type: "",
          benefits: [],
          logo_url: "",
        }}
      />
    </div>
  );
}
