import { sql as rawSql } from "../../db";
import { initSchema } from "../../db/schema";

let initPromise: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (!initPromise) initPromise = initSchema();
  return initPromise;
}

export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ rows: any[]; rowCount: number }> {
  await ensureInitialized();
  return rawSql(strings, ...values);
}
