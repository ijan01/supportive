import { sql as rawSql } from "../../db";
import { initSchema } from "../../db/schema";

let initPromise: Promise<void> | null = null;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  const t = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, t]);
}

function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = withTimeout(initSchema(), 12000, "Schema init").catch((err) => {
      initPromise = null; // Allow retry on next request
      throw err;
    });
  }
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
