import { getDb } from "../../db";
import { initSchema } from "../../db/schema";

let initialized = false;

export function db() {
  if (!initialized) {
    initSchema();
    initialized = true;
  }
  return getDb();
}
