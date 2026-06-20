import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readAdminCookie, isValidAdminToken } from "@/lib/admin-auth";

function isAdmin(request: Request): boolean {
  const cookie = readAdminCookie(request.headers.get("cookie"));
  return isValidAdminToken(cookie);
}

/**
 * DELETE /api/admin/logs/[id]
 *
 * Deletes a ShippingLog entry by id. Protected: requires a valid admin cookie.
 *
 * NOTE: if the deleted entry was the "latest" (the source of the next
 * newsletter issue), the next-newest entry becomes the latest automatically —
 * the latest endpoint always picks the most recent by createdAt.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await db.shippingLog.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    }

    await db.shippingLog.delete({ where: { id } });

    return NextResponse.json({ ok: true, deleted: id });
  } catch (err) {
    console.error("[DELETE /api/admin/logs/[id]] failed:", err);
    return NextResponse.json(
      {
        error: "Failed to delete the entry.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
