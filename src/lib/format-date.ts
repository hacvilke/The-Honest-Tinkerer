/**
 * Timezone-independent date formatting for SSR-safe rendering.
 *
 * `date-fns format()` uses the runtime's local timezone, which differs between
 * the server (Netlify Lambda = UTC) and the client (user's browser TZ). For
 * dates near midnight UTC, this produces different formatted strings on server
 * vs client → React hydration error #418 (text content mismatch).
 *
 * These helpers use UTC methods exclusively, so the output is identical on
 * server and client. No timezone dependency, no hydration mismatch.
 */

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "MMM d, yyyy" in UTC, e.g. "Nov 17, 2025" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "MMM d" in UTC, e.g. "Nov 17" */
export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** "yyyy-MM-dd" in UTC, e.g. "2025-11-17" */
export function formatDateLog(iso: string): string {
  const d = new Date(iso);
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${m}-${day}`;
}
