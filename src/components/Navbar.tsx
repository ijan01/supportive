import { getSession } from "@/lib/session";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getSession();
  const user = session?.user ? { role: session.user.role } : null;
  return <NavbarClient user={user} />;
}
