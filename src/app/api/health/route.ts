import { NextResponse } from "next/server";
import { sql } from "../../../../db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "(not set)",
    },
  };

  try {
    const result = await sql`SELECT 1 AS ok`;
    checks.db = { connected: true, result: result.rows[0] };
  } catch (err) {
    checks.db = { connected: false, error: String(err) };
  }

  return NextResponse.json(checks);
}
