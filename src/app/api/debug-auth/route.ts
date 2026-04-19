import { NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/users";

export const dynamic = "force-dynamic";

export async function GET() {
  const email = "company@demo.com";
  const password = "password123";
  const checks: Record<string, unknown> = {};

  try {
    const user = await getUserByEmail(email);
    checks.userFound = !!user;
    if (user) {
      checks.userId = user.id;
      checks.userEmail = user.email;
      checks.userRole = user.role;
      checks.hasPasswordHash = !!user.password_hash;
      checks.hashLength = user.password_hash?.length;

      const valid = await verifyPassword(password, user.password_hash);
      checks.passwordValid = valid;
    }
  } catch (err) {
    checks.error = String(err);
  }

  return NextResponse.json(checks);
}
