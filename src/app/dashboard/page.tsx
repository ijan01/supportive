import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function DashboardRedirect() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/login");

  const role = session.user.role;
  if (role === "admin") redirect("/admin");
  if (role === "company") redirect("/dashboard/company");
  redirect("/dashboard/seeker");
}
