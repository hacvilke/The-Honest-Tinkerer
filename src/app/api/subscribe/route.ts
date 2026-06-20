import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { sendVerification, isSmtpConfigured } from "@/lib/email";

const BodySchema = z.object({
  email: z.string().email(),
});

/**
 * Derive the site origin from the request so verification links point back
 * to this app (works in dev on localhost:3000 and in prod on the real domain).
 */
function originFromRequest(request: Request): string {
  // Trust forwarded proto/host when present (behind the Caddy gateway).
  const fwdProto = request.headers.get("x-forwarded-proto");
  const fwdHost = request.headers.get("x-forwarded-host");
  if (fwdHost) {
    return `${fwdProto ?? "https"}://${fwdHost}`;
  }
  try {
    const u = new URL(request.url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "http://localhost:3000";
  }
}

/**
 * POST /api/subscribe
 *
 * Body: { email: string }
 *
 * Double opt-in: creates the subscriber with a verify token, then emails them
 * a verification link. Broadcasts only go to verified addresses.
 *
 * Responses:
 *  - 400 invalid email: { error }
 *  - 200 new subscriber: { ok, verificationSent } (token emailed)
 *  - 200 existing + unverified: { ok, alreadySubscribed, verificationSent } (re-sent)
 *  - 200 existing + verified:   { ok, alreadySubscribed, verified }
 *  - 500 unexpected: { error }
 */
export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);

    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Give me a real email and I'll give you a real log." },
        { status: 400 }
      );
    }

    const email = parsed.data.email;
    const origin = originFromRequest(request);

    // Try to find an existing subscriber first (don't leak state, but we do
    // want to re-send the verification email if they're still unverified).
    const existing = await db.subscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.verifiedAt) {
        // Already verified — nothing to do.
        return NextResponse.json({
          ok: true,
          alreadySubscribed: true,
          verified: true,
        });
      }
      // Exists but unverified — regenerate token + re-send the verification.
      const token = randomUUID();
      await db.subscriber.update({
        where: { id: existing.id },
        data: { verifyToken: token },
      });
      const res = await sendVerification(email, token, origin);
      return NextResponse.json({
        ok: true,
        alreadySubscribed: true,
        verificationSent: res.delivered,
        messageId: res.messageId,
        smtpConfigured: isSmtpConfigured(),
      });
    }

    // New subscriber — create with a fresh verify token.
    const token = randomUUID();
    try {
      await db.subscriber.create({
        data: { email, verifyToken: token },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        // Race: created between our findUnique and create. Treat as success.
        return NextResponse.json({
          ok: true,
          alreadySubscribed: true,
        });
      }
      throw e;
    }

    const res = await sendVerification(email, token, origin);

    return NextResponse.json({
      ok: true,
      verificationSent: res.delivered,
      messageId: res.messageId,
      smtpConfigured: isSmtpConfigured(),
    });
  } catch (err) {
    console.error("[POST /api/subscribe] failed:", err);
    return NextResponse.json(
      { error: "Failed to subscribe. Try again in a moment." },
      { status: 500 }
    );
  }
}
