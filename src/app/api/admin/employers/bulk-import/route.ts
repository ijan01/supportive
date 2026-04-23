import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getUserByEmail, createUser } from "@/lib/users";
import { upsertEmployer, getEmployerBySlug } from "@/lib/employers";
import crypto from "crypto";

interface ImportRow {
  name: string;
  email?: string;
  website?: string;
  description?: string;
  organisation_type?: string;
  benefits?: string[];
  why_work_with_us?: string;
}

interface ImportResult {
  total: number;
  created: number;
  skipped: number;
  errors: string[];
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const rows = body.employers as ImportRow[];

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "employers array is required" }, { status: 400 });
  }

  if (rows.length > 200) {
    return NextResponse.json({ error: "Maximum 200 employers per batch" }, { status: 400 });
  }

  const result: ImportResult = { total: rows.length, created: 0, skipped: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const label = row.name || `Row ${i + 1}`;

    if (!row.name?.trim()) {
      result.errors.push(`${label}: name is required`);
      continue;
    }

    const slug = row.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    try {
      const existing = await getEmployerBySlug(slug);
      if (existing) {
        result.skipped++;
        continue;
      }

      const email = row.email?.trim() || `${slug}@placeholder.supportive.com.au`;
      const existingUser = await getUserByEmail(email);

      let userId: number;
      if (existingUser) {
        userId = existingUser.id;
      } else {
        const tempPassword = crypto.randomBytes(16).toString("hex");
        const newUser = await createUser(email, tempPassword, row.name, "company", row.name);
        userId = newUser.id;
      }

      await upsertEmployer(userId, {
        name: row.name.trim(),
        slug,
        website: row.website?.trim() || null,
        description: row.description?.trim() || null,
        why_work_with_us: row.why_work_with_us?.trim() || null,
        organisation_type: row.organisation_type || null,
        benefits: row.benefits || [],
      });

      result.created++;
    } catch (err) {
      result.errors.push(`${label}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return NextResponse.json({ ok: true, result });
}
