import { NextResponse } from "next/server";
import { readAdminCookie, isValidAdminToken } from "@/lib/admin-auth";

/**
 * GET /api/admin/session
 *
 * Returns { admin: true } if the request carries a valid admin cookie, else
 * { admin: false }. The client uses this to decide whether to show the login
 * form or the dashboard.
 */
export async function GET(request: Request) {
  const cookie = readAdminCookie(request.headers.get("cookie"));
  const admin = isValidAdminToken(cookie);
  return NextResponse.json({ admin });
}
