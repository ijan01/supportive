import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function clearAndRedirect(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete("authjs.session-token");
  cookieStore.delete("__Secure-authjs.session-token");
  const url = new URL("/", request.url);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  return clearAndRedirect(request);
}

export async function POST(request: NextRequest) {
  return clearAndRedirect(request);
}
