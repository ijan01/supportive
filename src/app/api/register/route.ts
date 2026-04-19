import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, companyName } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Email, password, name, and role are required" },
        { status: 400 }
      );
    }

    if (!["company", "seeker"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be 'company' or 'seeker'" },
        { status: 400 }
      );
    }

    if (role === "company" && !companyName) {
      return NextResponse.json(
        { error: "Company name is required for company accounts" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const user = await createUser(email, password, name, role, companyName);
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
