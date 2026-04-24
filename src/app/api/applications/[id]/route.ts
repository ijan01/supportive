import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { sql } from "@/lib/db";

const VALID_STATUSES = ["pending", "shortlisted", "contacted", "reviewed", "accepted", "rejected"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const appId = parseInt(id, 10);
  if (!appId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const body = await request.json();
  const { status } = body;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  // Verify ownership: the application must belong to a job owned by this employer
  const result = await sql`
    UPDATE applications SET status = ${status}
    WHERE id = ${appId}
      AND job_id IN (SELECT id FROM jobs WHERE user_id = ${Number(session.user.id)})
    RETURNING id
  `;

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Not found or not yours" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
