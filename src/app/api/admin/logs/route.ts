import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeed } from "@/lib/seed";
import { readAdminCookie, isValidAdminToken } from "@/lib/admin-auth";
import type { LogStatus, TimeBucket } from "@/lib/types";

const VALID_STATUSES: LogStatus[] = ["SHIPPED", "FAILED", "PIVOTED", "IN_PROGRESS"];
const VALID_TIMES: TimeBucket[] = ["< 1 hour", "1-4 hours", "1 day", "1 week+"];

const BodySchema = z.object({
  title: z.string().min(3).max(200),
  goal: z.string().min(3),
  techStack: z.string().min(2),
  wall: z.string().min(3),
  pivot: z.string().min(3),
  metric: z.string().min(3),
  status: z.enum(VALID_STATUSES as [string, ...string[]]),
  tools: z.array(z.string().min(1)).min(1),
  timeSpent: z.enum(VALID_TIMES as [string, ...string[]]),
  demo: z.string().nullable().optional(),
});

function isAdmin(request: Request): boolean {
  const cookie = readAdminCookie(request.headers.get("cookie"));
  return isValidAdminToken(cookie);
}

/**
 * POST /api/admin/logs
 *
 * Creates a new ShippingLog entry. The new entry automatically becomes the
 * "latest" shipping log, so the next newsletter issue renders from it.
 *
 * Protected: requires a valid admin cookie.
 *
 * Body:
 *   { title, goal, techStack, wall, pivot, metric, status, tools[], timeSpent, demo? }
 */
export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await ensureSeed();

    const json = await request.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid entry.", detail: parsed.error.issues },
        { status: 400 }
      );
    }

    const { title, goal, techStack, wall, pivot, metric, status, tools, timeSpent, demo } =
      parsed.data;

    const created = await db.shippingLog.create({
      data: {
        title,
        goal,
        techStack,
        wall,
        pivot,
        metric,
        status: status as string,
        toolStack: tools.join(","),
        timeSpent: timeSpent as string,
        demo: demo ?? null,
        // Use now() so it's the newest entry → becomes the next newsletter issue.
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      log: {
        id: created.id,
        title: created.title,
        status: created.status,
        createdAt: created.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("[POST /api/admin/logs] failed:", err);
    return NextResponse.json(
      {
        error: "Failed to create the entry.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
