import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL("/", request.url);
  const response = NextResponse.redirect(url);

  response.cookies.set("authjs.session-token", "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("__Secure-authjs.session-token", "", {
    path: "/",
    maxAge: 0,
    secure: true,
  });

  return response;
}
