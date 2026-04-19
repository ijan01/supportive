import { Pool, QueryResult } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<QueryResult> {
  let query = "";
  const params: unknown[] = [];
  strings.forEach((str, i) => {
    query += str;
    if (i < values.length) {
      params.push(values[i]);
      query += `$${params.length}`;
    }
  });
  return pool.query(query, params);
}
