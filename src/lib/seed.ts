import { db } from "@/lib/db";
import { SEED_LOGS, SEED_BROADCASTS } from "@/lib/content";
import type { ShippingLog } from "@/lib/types";

/**
 * Ensure the ShippingLog + Broadcast tables match the seed data.
 *
 * - Idempotent per stable key: each shipping log is upserted by id, each
 *   broadcast by issue number, so new entries land in an already-populated DB
 *   and edited seed content refreshes.
 * - Never throws: any error is logged and swallowed so a request can never
 *   crash because of seeding.
 *
 * Server-only. No "use client".
 */
export async function ensureSeed(): Promise<void> {
  try {
    for (const log of SEED_LOGS) {
      await db.shippingLog.upsert({
        where: { id: log.id },
        update: {
          title: log.title,
          goal: log.goal,
          techStack: log.techStack,
          wall: log.wall,
          pivot: log.pivot,
          metric: log.metric,
          status: log.status,
          toolStack: log.toolStack,
          timeSpent: log.timeSpent,
          demo: log.demo ?? null,
          createdAt: new Date(log.createdAt),
        },
        create: {
          id: log.id,
          title: log.title,
          goal: log.goal,
          techStack: log.techStack,
          wall: log.wall,
          pivot: log.pivot,
          metric: log.metric,
          status: log.status,
          toolStack: log.toolStack,
          timeSpent: log.timeSpent,
          demo: log.demo ?? null,
          createdAt: new Date(log.createdAt),
        },
      });
    }

    for (const b of SEED_BROADCASTS) {
      await db.broadcast.upsert({
        where: { issue: b.issue },
        update: {
          subject: b.subject,
          logId: b.logId,
          logTitle: b.logTitle,
          recipientCount: b.recipientCount,
          sentAt: new Date(b.sentAt),
        },
        create: {
          issue: b.issue,
          subject: b.subject,
          logId: b.logId,
          logTitle: b.logTitle,
          recipientCount: b.recipientCount,
          sentAt: new Date(b.sentAt),
        },
      });
    }
  } catch (err) {
    // Never crash a request because of seeding.
    console.error("[ensureSeed] seeding failed:", err);
  }
}
