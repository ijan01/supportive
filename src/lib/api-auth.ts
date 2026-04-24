import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, Session } from "./session";

export async function requireSession(request: NextRequest): Promise<Session | NextResponse> {
  const session = await getSessionFromRequest(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireCompanySession(request: NextRequest): Promise<Session | NextResponse> {
  const session = await getSessionFromRequest(request);
  if (!session?.user || session.user.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireAdminSession(request: NextRequest): Promise<Session | NextResponse> {
  const session = await getSessionFromRequest(request);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export function requireCronAuth(request: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  return null;
}

export function isNextResponse(value: Session | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}
