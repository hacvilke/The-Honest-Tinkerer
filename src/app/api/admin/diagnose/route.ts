import { NextResponse } from "next/server";

/**
 * GET /api/admin/diagnose
 *
 * Temporary diagnostic endpoint that reports which admin env vars are set,
 * revealing only enough to debug (first 3 chars + length, never the full
 * value). Safe to remove later.
 */
export async function GET() {
  const email = process.env.EMAIL_ADMIN;
  const pass = process.env.PASSWORD_ADMIN;
  return NextResponse.json({
    EMAIL_ADMIN_set: Boolean(email),
    EMAIL_ADMIN_length: email?.length ?? 0,
    EMAIL_ADMIN_preview: email ? email.slice(0, 3) + "..." : "(empty)",
    PASSWORD_ADMIN_set: Boolean(pass),
    PASSWORD_ADMIN_length: pass?.length ?? 0,
    PASSWORD_ADMIN_preview: pass ? pass.slice(0, 3) + "..." : "(empty)",
    NODE_ENV: process.env.NODE_ENV ?? "NOT SET",
    note: "If EMAIL_ADMIN_set is false, the env var is not reaching the function. Check Netlify → Site settings → Environment variables — make sure the key is exactly EMAIL_ADMIN (all caps) and it's scoped to Functions + Deploys + Post processing.",
  });
}
