import { sql, ensureInitialized } from "./db";
import { User, UserRow } from "./types";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email: string): Promise<UserRow | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  return result.rows[0] as UserRow | undefined;
}

export async function getUserById(id: number): Promise<User | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT id, email, name, role, company_name, created_at FROM users WHERE id = ${id}`;
  return result.rows[0] as User | undefined;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: "company" | "seeker",
  companyName?: string
): Promise<User> {
  await ensureInitialized();
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await sql`
    INSERT INTO users (email, password_hash, name, role, company_name)
    VALUES (${email}, ${passwordHash}, ${name}, ${role}, ${companyName || null})
    RETURNING id, email, name, role, company_name, created_at
  `;
  return result.rows[0] as User;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
