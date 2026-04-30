"use server";

import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { encode } from "next-auth/jwt";
import { getUserByEmail, verifyPassword } from "@/lib/users";
import { rateLimit } from "@/lib/rate-limit";
import { getAuthSecret } from "@/lib/session";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.ok) {
    return { error: "Too many login attempts. Please try again in a few minutes." };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  let secret: string;
  try {
    secret = getAuthSecret();
  } catch {
    return { error: "Authentication is not configured. Please contact support." };
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

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
