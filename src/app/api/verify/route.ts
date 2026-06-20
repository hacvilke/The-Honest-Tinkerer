import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/verify?token=XXX
 *
 * Double opt-in confirmation. Looks up the subscriber by verifyToken:
 *  - found + unverified → mark verifiedAt now, clear the token, redirect to
 *    the app with ?verified=1 so the UI can toast a confirmation.
 *  - found + already verified → redirect with ?verified=1&already=1.
 *  - not found / empty token → redirect with ?verified=0 (invalid link).
 *
 * Redirect target is the SPA root so the newsletter view can react.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // Build a redirect back to the app. Prefer the forwarded host so it works
  // behind the gateway; fall back to the request origin.
  const fwdProto = request.headers.get("x-forwarded-proto");
  const fwdHost = request.headers.get("x-forwarded-host");
  let base = "http://localhost:3000";
  if (fwdHost) {
    base = `${fwdProto ?? "https"}://${fwdHost}`;
  } else {
    try {
      const u = new URL(request.url);
      base = `${u.protocol}//${u.host}`;
    } catch {
      /* keep default */
    }
  }

  if (!token) {
    return NextResponse.redirect(
      new URL(`${base}/?verified=0#/newsletter`)
    );
  }

  const sub = await db.subscriber.findFirst({
    where: { verifyToken: token },
  });

  if (!sub) {
    return NextResponse.redirect(
      new URL(`${base}/?verified=0#/newsletter`)
    );
  }

  if (sub.verifiedAt) {
    return NextResponse.redirect(
      new URL(`${base}/?verified=1&already=1#/newsletter`)
    );
  }

  await db.subscriber.update({
    where: { id: sub.id },
    data: { verifiedAt: new Date(), verifyToken: null },
  });

  return NextResponse.redirect(new URL(`${base}/?verified=1#/newsletter`));
}
