import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import PostJobForm from "@/components/PostJobForm";

export default async function PostJobPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "company") redirect("/dashboard/seeker");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Post a Job</h1>
        <p className="text-slate-500 mt-1">Create a new job listing to attract top talent</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <PostJobForm defaultCompany={session.user.companyName || ""} />
      </div>
    </div>
  );
}
