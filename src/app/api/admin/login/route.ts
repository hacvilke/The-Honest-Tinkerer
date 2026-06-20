import { NextResponse } from "next/server";
import { z } from "zod";
import {
  checkAdminCredentials,
  createAdminToken,
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
} from "@/lib/admin-auth";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * POST /api/admin/login
 *
 * Body: { email, password }
 *
 * Validates against EMAIL_ADMIN + PASSWORD_ADMIN env vars. On success, sets an
 * httpOnly cookie containing a signed admin token (7-day expiry).
 *
 * - 200 { ok: true } on success (cookie set)
 * - 400 { error } on invalid body
 * - 401 { error } on wrong credentials
 * - 500 { error } on unexpected failure
 */
export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    if (!checkAdminCredentials(email, password)) {
      return NextResponse.json(
        { error: "Wrong email or password." },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_COOKIE_MAX_AGE,
    });
    return res;
  } catch (err) {
    console.error("[POST /api/admin/login] failed:", err);
    return NextResponse.json(
      { error: "Login failed. Try again." },
      { status: 500 }
    );
  }
}
