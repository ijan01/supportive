import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { sql } from "@/lib/db";
import { DEFAULT_MODEL_ID, DEFAULT_SYSTEM_PROMPT, CONTENT_MODELS } from "@/constants/content-models";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await sql`SELECT model_id, system_prompt FROM agent_settings WHERE id = 1`;
    if (result.rows.length === 0) {
      return NextResponse.json({ model_id: DEFAULT_MODEL_ID, system_prompt: DEFAULT_SYSTEM_PROMPT });
    }
    const row = result.rows[0] as { model_id: string; system_prompt: string };
    return NextResponse.json({
      model_id: row.model_id,
      system_prompt: row.system_prompt || DEFAULT_SYSTEM_PROMPT,
    });
  } catch {
    return NextResponse.json({ model_id: DEFAULT_MODEL_ID, system_prompt: DEFAULT_SYSTEM_PROMPT });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { model_id, system_prompt } = body as { model_id?: string; system_prompt?: string };

  const validModelId = model_id && CONTENT_MODELS.find((m) => m.id === model_id) ? model_id : undefined;
  const validPrompt = typeof system_prompt === "string" && system_prompt.trim().length > 0 ? system_prompt.trim() : undefined;

  if (!validModelId && !validPrompt) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    // Ensure the table exists (idempotent)
    await sql`
      CREATE TABLE IF NOT EXISTS agent_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        model_id TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
        system_prompt TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Fetch current to merge partial updates
    const current = await sql`SELECT model_id, system_prompt FROM agent_settings WHERE id = 1`;
    const currentRow = current.rows[0] as { model_id: string; system_prompt: string } | undefined;

    const newModelId = validModelId ?? currentRow?.model_id ?? DEFAULT_MODEL_ID;
    const newPrompt = validPrompt ?? (currentRow?.system_prompt || DEFAULT_SYSTEM_PROMPT);

    if (currentRow) {
      await sql`
        UPDATE agent_settings SET
          model_id = ${newModelId},
          system_prompt = ${newPrompt},
          updated_at = NOW()
        WHERE id = 1
      `;
    } else {
      await sql`
        INSERT INTO agent_settings (id, model_id, system_prompt, updated_at)
        VALUES (1, ${newModelId}, ${newPrompt}, NOW())
      `;
    }

    return NextResponse.json({ ok: true, model_id: newModelId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[agent-settings] PUT error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
