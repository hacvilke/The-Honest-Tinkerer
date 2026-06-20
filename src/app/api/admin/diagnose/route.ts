import { NextResponse } from "next/server";

/**
 * GET /api/admin/diagnose
 *
 * Temporary diagnostic endpoint that reports which admin env vars are set,
 * WITHOUT revealing their values. This helps confirm whether EMAIL_ADMIN and
 * PASSWORD_ADMIN are configured on Netlify. Safe to remove later.
 */
export async function GET() {
  return NextResponse.json({
    EMAIL_ADMIN_set: Boolean(process.env.EMAIL_ADMIN),
    EMAIL_ADMIN_length: process.env.EMAIL_ADMIN?.length ?? 0,
    PASSWORD_ADMIN_set: Boolean(process.env.PASSWORD_ADMIN),
    PASSWORD_ADMIN_length: process.env.PASSWORD_ADMIN?.length ?? 0,
    NODE_ENV: process.env.NODE_ENV ?? "NOT SET",
    note: "If EMAIL_ADMIN_set or PASSWORD_ADMIN_set is false, set them in Netlify → Site settings → Environment.",
  });
}
