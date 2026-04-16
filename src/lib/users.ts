import { db } from "./db";
import { User, UserRow } from "./types";
import bcrypt from "bcryptjs";

export function getUserByEmail(email: string): UserRow | undefined {
  return db().prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
}

export function getUserById(id: number): User | undefined {
  const row = db().prepare("SELECT id, email, name, role, company_name, created_at FROM users WHERE id = ?").get(id) as User | undefined;
  return row;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: "company" | "seeker",
  companyName?: string
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = db()
    .prepare(
      "INSERT INTO users (email, password_hash, name, role, company_name) VALUES (?, ?, ?, ?, ?)"
    )
    .run(email, passwordHash, name, role, companyName || null);

  return getUserById(Number(result.lastInsertRowid))!;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
