import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const useSecureCookies = process.env.NODE_ENV === "production";
  const name = useSecureCookies
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
    secureCookie: useSecureCookies,
    cookieName: name,
  });
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/admin/:path*"],
};
