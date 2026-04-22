import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { createContentPlanItem, updateContentPlanItem, deleteContentPlanItem } from "@/lib/content-plan";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "create") {
    const item = await createContentPlanItem(body);
    return NextResponse.json({ ok: true, item });
  }

  if (action === "update") {
    const { id, action: _a, ...updates } = body;
    const item = await updateContentPlanItem(id, updates);
    return NextResponse.json({ ok: true, item });
  }

  if (action === "delete") {
    await deleteContentPlanItem(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
