import { redirect, notFound } from "next/navigation";
import { auth } from "../../../../../../auth";
import { getJobById } from "@/lib/jobs";
import PostJobForm from "@/components/PostJobForm";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "company") redirect("/dashboard/seeker");

  const { id } = await params;
  const job = await getJobById(Number(id));
  if (!job) notFound();
  if (job.user_id !== Number(session.user.id)) redirect("/dashboard/company");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Edit Job</h1>
        <p className="text-slate-500 mt-1">Update your job listing</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <PostJobForm existingJob={job} />
      </div>
    </div>
  );
}
