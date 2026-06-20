import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

/**
 * Database client — lazy-initialized via a Proxy so that a missing DB config
 * doesn't crash the serverless function at import time. The client is only
 * created on first query, which means any "database not configured" error
 * surfaces inside the route handler's try/catch (returning a helpful 500)
 * instead of killing the function before it can respond.
 *
 * Two modes, picked by environment:
 *
 * 1. Hosted (Netlify / production) — set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.
 *    Uses the libSQL driver adapter against Turso (SQLite-compatible, hosted),
 *    so subscribers + broadcasts persist across serverless cold starts.
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
    // PrismaLibSQL takes a Config object { url, authToken }, NOT a pre-created
    // client. It creates + manages its own @libsql/client internally.
    return new PrismaClient({
      adapter: new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken }),
      log: ["error", "warn"],
    });
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Database not configured for production: set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars on Netlify. " +
        "See netlify.toml for the full list of required environment variables."
    );
  }

  // Local dev: file-backed SQLite.
  return new PrismaClient({ log: ["error", "warn"] });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lazy singleton — the Proxy intercepts the first property access (e.g.
// `db.shippingLog`) and creates the client at that point, not at import time.
let _client: PrismaClient | undefined;

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!_client) {
      _client = globalForPrisma.prisma ?? createPrismaClient();
      if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = _client;
    }
    return Reflect.get(_client, prop);
  },
});
