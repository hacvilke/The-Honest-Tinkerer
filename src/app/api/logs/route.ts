import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeed } from "@/lib/seed";
import type { ShippingLogDTO } from "@/lib/types";

/**
 * GET /api/logs
 *
 * Query params (all optional, case-sensitive exact match):
 *   - status  : one of "SHIPPED" | "FAILED" | "PIVOTED" | "IN_PROGRESS"
 *   - tool    : substring match against the comma-separated `toolStack`
 *   - time    : one of "< 1 hour" | "1-4 hours" | "1 day" | "1 week+"
 *
 * Returns: { logs: ShippingLogDTO[] } sorted by createdAt desc.
 */
export async function GET(request: Request) {
  try {
    await ensureSeed();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const tool = searchParams.get("tool") ?? undefined;
    const time = searchParams.get("time") ?? undefined;

    // Build `where` conditionally.
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (time) where.timeSpent = time;
    if (tool) where.toolStack = { contains: tool };

    const rows = await db.shippingLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const logs: ShippingLogDTO[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      goal: row.goal,
      techStack: row.techStack,
      wall: row.wall,
      pivot: row.pivot,
      metric: row.metric,
      status: row.status as ShippingLogDTO["status"],
      tools: row.toolStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      timeSpent: row.timeSpent as ShippingLogDTO["timeSpent"],
      demo: row.demo ?? null,
      createdAt: row.createdAt.toISOString(),
    }));

    return NextResponse.json({ logs });
  } catch (err) {
    console.error("[GET /api/logs] failed:", err);
    return NextResponse.json(
      {
        error: "Failed to load shipping logs.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
