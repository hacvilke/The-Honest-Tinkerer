import { createHmac, timingSafeEqual } from "crypto";

/**
 * Admin dashboard authentication.
 *
 * The admin is identified by EMAIL_ADMIN + PASSWORD_ADMIN env vars (no DB
 * user table needed — it's a single-operator site). Login validates those,
 * then sets an httpOnly cookie containing an HMAC-signed token so subsequent
 * requests are authenticated without re-sending the password.
 *
 * Server-only. No "use client".
 */

const COOKIE_NAME = "honest_tinkerer_admin";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getSecret(): string {
  // Derive the signing secret from the admin password + a salt so the token
  // can't be forged without knowing the password.
  return `htk::${process.env.PASSWORD_ADMIN ?? "no-password-set"}`;
}

/** Sign a payload with the HMAC secret. Returns "payload.signature". */
function sign(payload: string): string {
  const sig = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

/** Verify a signed token. Returns the payload if valid, null otherwise. */
function verify(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx === -1) return null;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  try {
    if (sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return payload;
    }
  } catch {
    /* length mismatch → not equal */
  }
  return null;
}

/** Validate email + password against env vars. */
export function checkAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.EMAIL_ADMIN;
  const adminPass = process.env.PASSWORD_ADMIN;
  if (!adminEmail || !adminPass) return false;
  try {
    const emailOk =
      email.length === adminEmail.length &&
      timingSafeEqual(Buffer.from(email), Buffer.from(adminEmail));
    const passOk =
      password.length === adminPass.length &&
      timingSafeEqual(Buffer.from(password), Buffer.from(adminPass));
    return emailOk && passOk;
  } catch {
    return false;
  }
}

/** Create a signed admin token for a cookie. */
export function createAdminToken(): string {
  const expires = Date.now() + TOKEN_MAX_AGE * 1000;
  return sign(`admin:${expires}`);
}

/** Validate a token from a cookie. Returns true if valid + not expired. */
export function isValidAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const payload = verify(token);
  if (!payload) return false;
  const parts = payload.split(":");
  if (parts.length !== 2 || parts[0] !== "admin") return false;
  const expires = Number(parts[1]);
  if (!expires || Date.now() > expires) return false;
  return true;
}

/** Cookie name + options for setHeader / parse. */
export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = TOKEN_MAX_AGE;

/** Parse the admin cookie from a Cookie header string. */
export function readAdminCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(COOKIE_NAME.length + 1));
}
