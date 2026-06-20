import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

/**
 * Database client.
 *
 * Two modes, picked by environment:
 *
 * 1. Hosted (Netlify / production) — set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.
 *    Uses the libSQL driver adapter against Turso (SQLite-compatible, hosted),
 *    so subscribers + broadcasts actually persist across serverless cold starts.
 *    If these vars are set in production but missing/empty, we throw loudly
 *    rather than silently fall back to an ephemeral local file (that would
 *    lose every subscriber between invocations — the wrong kind of quiet).
 *
 * 2. Local dev — falls back to the file SQLite at DATABASE_URL
 *    (file:./db/custom.db). No Turso account needed.
 *
 * Server-only. No "use client".
 */
function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoToken) {
    const libsql = createClient({ url: tursoUrl, authToken: tursoToken });
    return new PrismaClient({
      adapter: new PrismaLibSQL(libsql),
      log: ["error", "warn"],
    });
  }

  if (process.env.NODE_ENV === "production") {
    // In production without Turso configured, refuse to start — a local file
    // on Netlify's ephemeral filesystem would silently lose all writes.
    throw new Error(
      "Database not configured for production: set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN (Turso libSQL). " +
        "See netlify.toml for required environment variables."
    );
  }

  // Local dev: file-backed SQLite.
  return new PrismaClient({ log: ["error", "warn"] });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
