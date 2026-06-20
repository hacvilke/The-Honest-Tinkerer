import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeed } from "@/lib/seed";
import { BLUEVIBE_DEMO } from "@/lib/content";
import { STATUS_META, type NewsletterIssue } from "@/lib/types";
import { sendBroadcast, isSmtpConfigured } from "@/lib/email";

function deriveHook(title: string): string {
  const t = title.trim();
  if (!t) return "the week I forgot to write the subject";
  return t.charAt(0).toLowerCase() + t.slice(1);
}

function deriveTldr(goal: string, status: string): string {
  const meta = STATUS_META[status as keyof typeof STATUS_META];
  const label = meta ? meta.label : status;
  const verb =
    status === "SHIPPED" ? "shipped" : status === "FAILED" ? "tanked" : "pivoted";
  const g = goal.endsWith(".") ? goal.slice(0, -1) : goal;
  return `Tried: ${g}. Verdict: ${label} — it ${verb}.`;
}

/**
 * POST /api/newsletter/broadcast
 *
 * Renders the latest shipping log into a Friday Log Dump email and DELIVERS it
 * to every subscriber via SMTP (Gmail App Password). Records the send in the
 * Broadcast outbox with the recipient count.
 *
 * Idempotent: if a broadcast already exists for the latest log's id, returns
 * the existing one with `alreadySent: true` — no re-send (subscribers would be
 * spammed otherwise).
 *
 * If SMTP isn't configured, falls back to a simulated send (records the row
 * without delivering) so the loop still works in dev.
 */
export async function POST() {
  try {
    await ensureSeed();

    const latestLog = await db.shippingLog.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestLog) {
      return NextResponse.json(
        { error: "No shipping logs to broadcast." },
        { status: 404 }
      );
    }

    // Already broadcast this exact log? Return the existing record — do NOT
    // re-send emails (idempotency protects subscribers from duplicate sends).
    const existing = await db.broadcast.findFirst({
      where: { logId: latestLog.id },
    });
    if (existing) {
      return NextResponse.json({
        ok: true,
        alreadySent: true,
        broadcast: {
          id: existing.id,
          issue: existing.issue,
          subject: existing.subject,
          logId: existing.logId,
          logTitle: existing.logTitle,
          recipientCount: existing.recipientCount,
          sentAt: existing.sentAt.toISOString(),
        },
      });
    }

    // Only VERIFIED subscribers receive the broadcast (double opt-in).
    const [broadcastCount, verifiedCount, totalSubscribers, subscribers] =
      await Promise.all([
        db.broadcast.count(),
        db.subscriber.count({ where: { verifiedAt: { not: null } } }),
        db.subscriber.count(),
        db.subscriber.findMany({
          where: { verifiedAt: { not: null } },
          select: { email: true },
        }),
      ]);

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
      alreadySent: false,
    };

    // --- Real delivery: send to every VERIFIED subscriber via SMTP (BCC, one
    // message). If SMTP isn't configured, this returns delivered:false and we
    // still record the broadcast (simulated send) so the loop stays honest.
    const recipients = subscribers.map((s) => s.email);
    const result = await sendBroadcast(issue, recipients);

    if (!result.delivered && isSmtpConfigured() && recipients.length > 0) {
      // SMTP was configured and we had recipients, but the send genuinely
      // failed — don't record a phantom broadcast; let the user retry.
      return NextResponse.json(
        { error: `Email send failed: ${result.error ?? "unknown error"}` },
        { status: 502 }
      );
    }

    const issueNo = broadcastCount + 1;
    const subject = issue.subject;

    const created = await db.broadcast.create({
      data: {
        issue: issueNo,
        subject,
        logId: latestLog.id,
        logTitle: latestLog.title,
        recipientCount: verifiedCount,
      },
    });

    return NextResponse.json({
      ok: true,
      delivered: result.delivered,
      messageId: result.messageId,
      broadcast: {
        id: created.id,
        issue: created.issue,
        subject: created.subject,
        logId: created.logId,
        logTitle: created.logTitle,
        recipientCount: created.recipientCount,
        sentAt: created.sentAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("[POST /api/newsletter/broadcast] failed:", err);
    return NextResponse.json(
      { error: "Failed to send the issue. The outbox is grumpy." },
      { status: 500 }
    );
  }
}
