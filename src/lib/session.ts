import { cookies } from "next/headers";
import { decode, getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

function getSecret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s && typeof window === "undefined" && process.env.NODE_ENV === "production" && !process.env.NEXT_PHASE) {
    console.warn("[session] NEXTAUTH_SECRET is not set — using development fallback");
  }
  return s || "development-secret-change-in-production";
}

const SECRET = getSecret();

function cookieName() {
  return process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
}

export type SessionRole = "seeker" | "company" | "admin";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: SessionRole;
  companyName: string | null;
}

export interface Session {
  user: SessionUser;
}

export async function getSession(): Promise<Session | null> {
  const name = cookieName();
  const cookieStore = await cookies();
  const value = cookieStore.get(name)?.value;
  if (!value) return null;
  try {
    const token = await decode({ token: value, secret: SECRET, salt: name });
    if (!token) return null;
    return {
      user: {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as SessionRole,
        companyName: (token.companyName as string) || null,
      },
    };
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(request: NextRequest): Promise<Session | null> {
  const name = cookieName();
  const token = await getToken({
    req: request,
    secret: SECRET,
    secureCookie: process.env.NODE_ENV === "production",
    cookieName: name,
  });
  if (!token) return null;
  return {
    user: {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: token.role as SessionRole,
      companyName: (token.companyName as string) || null,
    },
  };
}
