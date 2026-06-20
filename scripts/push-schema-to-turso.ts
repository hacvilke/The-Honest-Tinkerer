/**
 * Push the Prisma schema to a Turso (libSQL) database.
 *
 * Usage:
 *   TURSO_DATABASE_URL=libsql://...  \
 *   TURSO_AUTH_TOKEN=<token>         \
 *   bun run scripts/push-schema-to-turso.ts
 *
 * Emits the CREATE TABLE / CREATE INDEX SQL via `prisma migrate diff` and
 * executes it against Turso. Safe to re-run: statements that fail because the
 * table/index already exists are reported and skipped.
 *
 * The auth token is read from the environment only — never written to disk.
 */
import { createClient } from "@libsql/client";
import { execSync } from "node:child_process";

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  console.error(
    "Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN. Set both in the environment and retry."
  );
  process.exit(1);
}

// 1. Generate the full schema SQL from prisma/schema.prisma.
const raw = execSync(
  "bunx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
  { encoding: "utf-8" }
);

// 2. Strip comment lines, then split on semicolons into individual statements.
const sql = raw
  .split("\n")
  .filter((l) => !l.trim().startsWith("--"))
  .join("\n");
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(`Generated ${statements.length} schema statements.`);
console.log("Connecting to Turso:", url.replace(/\/\/.*@/, "//***@"));

const client = createClient({ url, authToken: token });

let ok = 0;
let skipped = 0;
const errors: string[] = [];

for (const stmt of statements) {
  const preview = stmt.split("\n")[0].slice(0, 70);
  try {
    await client.execute(stmt);
    ok++;
    console.log(`  \u2713 ${preview}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/already exists/i.test(msg)) {
      skipped++;
      console.log(`  - skip (already exists): ${preview}`);
    } else {
      errors.push(`${preview}\n    ${msg}`);
      console.log(`  \u2717 FAILED: ${preview}\n      ${msg}`);
    }
  }
}

console.log(`\nDone: ${ok} created, ${skipped} skipped, ${errors.length} failed.`);
if (errors.length > 0) process.exit(1);
process.exit(0);
