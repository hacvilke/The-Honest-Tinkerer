import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeed } from "@/lib/seed";
import type { Broadcast } from "@/lib/types";

/**
 * GET /api/newsletter/broadcasts
 *
 * The newsletter outbox / archive — every "sent" Friday Log Dump issue,
 * newest first.
 */
export async function GET() {
  try {
    await ensureSeed();

    const rows = await db.broadcast.findMany({
      orderBy: { issue: "desc" },
    });

    const broadcasts: Broadcast[] = rows.map((r) => ({
      id: r.id,
      issue: r.issue,
      subject: r.subject,
      logId: r.logId,
      logTitle: r.logTitle,
      recipientCount: r.recipientCount,
      sentAt: r.sentAt.toISOString(),
    }));

    return NextResponse.json({ broadcasts });
  } catch (err) {
    console.error("[GET /api/newsletter/broadcasts] failed:", err);
    return NextResponse.json(
      { error: "Failed to load the broadcast archive." },
      { status: 500 }
    );
  }
}
