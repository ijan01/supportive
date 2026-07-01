import postgres from "postgres";

const db = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_URL?.includes("localhost") ? false : "require",
  max: 10,
  idle_timeout: 30,
  connect_timeout: 5,
  connection: {
    statement_timeout: 15000,
  },
});

export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ rows: any[]; rowCount: number }> {
  let query = "";
  const params: unknown[] = [];
  strings.forEach((str, i) => {
    query += str;
    if (i < values.length) {
      params.push(values[i]);
      query += `$${params.length}`;
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await db.unsafe(query, params as any[]);
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: result as any[],
    rowCount: result.count,
  };
}
