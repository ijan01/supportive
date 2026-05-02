import { Metadata } from "next";
import { sql } from "@/lib/db";
import { DEFAULT_MODEL_ID, DEFAULT_SYSTEM_PROMPT } from "@/constants/content-models";
import AgentSettingsClient from "./client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Content Agent" };

export default async function AgentSettingsPage() {
  await sql`
    CREATE TABLE IF NOT EXISTS agent_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      model_id TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
      system_prompt TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.catch(() => {});
  const result = await sql`SELECT model_id, system_prompt FROM agent_settings WHERE id = 1`.catch(() => ({ rows: [] }));
  const row = result.rows[0] as { model_id: string; system_prompt: string } | undefined;

  return (
    <AgentSettingsClient
      initialModelId={row?.model_id ?? DEFAULT_MODEL_ID}
      initialSystemPrompt={row?.system_prompt || DEFAULT_SYSTEM_PROMPT}
      defaultSystemPrompt={DEFAULT_SYSTEM_PROMPT}
    />
  );
}
