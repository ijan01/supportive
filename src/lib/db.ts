import { sql } from "../../db";
import { initSchema } from "../../db/schema";

let initPromise: Promise<void> | null = null;

export async function ensureInitialized(): Promise<void> {
  if (!initPromise) initPromise = initSchema();
  await initPromise;
}

export { sql };
