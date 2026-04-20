"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";
import { createUser, getUserByEmail } from "@/lib/users";

export async function registerAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as "seeker" | "company";
  const companyName = formData.get("companyName") as string | null;

  if (!email || !password || !name || !role) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const user = await createUser(email, password, name, role, companyName || undefined);

  const secret = process.env.NEXTAUTH_SECRET || "development-secret-change-in-production";
  const useSecureCookies = process.env.NODE_ENV === "production";
  const cookieName = useSecureCookies
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = await encode({
    token: {
      sub: String(user.id),
      id: String(user.id),
      email: user.email,
      name: user.name,
      role: user.role,
      companyName: user.company_name || null,
    },
    secret,
    salt: cookieName,
  });

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  const callbackUrl = formData.get("callbackUrl") as string;
  redirect(callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard");
}
