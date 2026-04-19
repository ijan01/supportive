import { redirect } from "next/navigation";
import { auth } from "../../../auth";

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const role = session.user.role;
  if (role === "company") redirect("/dashboard/company");
  redirect("/dashboard/seeker");
}
