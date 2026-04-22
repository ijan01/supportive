/**
 * Database connection stub.
 *
 * Replace this with your own database connection. The content engine
 * uses tagged template literals for parameterised queries:
 *
 *   const result = await sql`SELECT * FROM posts WHERE id = ${id}`;
 *   // result.rows: Record<string, unknown>[]
 *   // result.rowCount: number
 *
 * Using postgres.js (https://github.com/porsager/postgres):
 *
 *   import postgres from "postgres";
 *   const db = postgres(process.env.POSTGRES_URL!);
 *   export const sql = db;
 *
 * Or any other PostgreSQL client that supports tagged templates.
 */

import postgres from "postgres";

const db = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
  max: 10,
});

export async function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  const result = await db(strings, ...values);
  return { rows: result as Record<string, unknown>[], rowCount: result.length };
}

let _initialized = false;
export async function ensureInitialized() {
  if (_initialized) return;
  // Run your schema init here if needed
  _initialized = true;
}
