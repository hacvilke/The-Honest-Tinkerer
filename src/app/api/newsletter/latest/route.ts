import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeed } from "@/lib/seed";
import { BLUEVIBE_DEMO } from "@/lib/content";
import { STATUS_META, type NewsletterIssue } from "@/lib/types";

/**
 * Derive a punchy subject hook from a shipping log.
 * Lowercases the first letter so it reads as a sentence after "Log #N:".
 */
function deriveHook(title: string): string {
  const t = title.trim();
  if (!t) return "the week I forgot to write the subject";
  return t.charAt(0).toLowerCase() + t.slice(1);
}

/**
 * One-line TL;DR from the entry's goal + status.
 */
function deriveTldr(goal: string, status: string): string {
  const meta = STATUS_META[status as keyof typeof STATUS_META];
  const label = meta ? meta.label : status;
  const shipped = status === "SHIPPED";
  const verb = shipped ? "shipped" : status === "FAILED" ? "tanked" : "pivoted";
  // Keep it to ~1 sentence.
  const g = goal.endsWith(".") ? goal.slice(0, -1) : goal;
  return `Tried: ${g}. Verdict: ${label} — it ${verb}.`;
}

/**
 * GET /api/newsletter/latest
 *
 * Renders the "Friday Log Dump" email from the most recent shipping log entry.
 * Returns a NewsletterIssue ready to preview or hand to an email provider.
 */
export async function GET() {
  try {
    await ensureSeed();

    const [latestLog, broadcastCount, verifiedCount, totalSubscribers] =
      await Promise.all([
        db.shippingLog.findFirst({
          orderBy: { createdAt: "desc" },
        }),
        db.broadcast.count(),
        // Only verified subscribers count toward the broadcast audience.
        db.subscriber.count({ where: { verifiedAt: { not: null } } }),
        db.subscriber.count(),
      ]);

    if (!latestLog) {
      return NextResponse.json(
        { error: "No shipping logs to render an issue from." },
        { status: 404 }
      );
    }

    // Was this specific log already broadcast? Look it up by logId.
    const alreadySentRow = await db.broadcast.findFirst({
      where: { logId: latestLog.id },
    });

    const issue: NewsletterIssue = {
      issue: broadcastCount + 1,
      subject: `Log #${String(broadcastCount + 1).padStart(2, "0")}: ${deriveHook(
        latestLog.title
      )}`,
      tldr: deriveTldr(latestLog.goal, latestLog.status),
      goal: latestLog.goal,
      stack: latestLog.techStack,
      status: `[STATUS: ${STATUS_META[latestLog.status as keyof typeof STATUS_META]?.label ?? latestLog.status}]`,
      broke: latestLog.wall,
      workaround: latestLog.pivot,
      links: {
        site: "/#/log",
        repo:
          latestLog.demo === BLUEVIBE_DEMO.kind
            ? BLUEVIBE_DEMO.externalUrl
            : null,
      },
      logId: latestLog.id,
      logTitle: latestLog.title,
      subscriberCount: verifiedCount,
      totalSubscribers,
      alreadySent: Boolean(alreadySentRow),
    };

    return NextResponse.json({ issue });
  } catch (err) {
    console.error("[GET /api/newsletter/latest] failed:", err);
    return NextResponse.json(
      { error: "Failed to render the latest issue." },
      { status: 500 }
    );
  }
}
