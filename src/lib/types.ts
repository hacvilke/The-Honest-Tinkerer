export type LogStatus = "SHIPPED" | "FAILED" | "PIVOTED" | "IN_PROGRESS";

export type TimeBucket = "< 1 hour" | "1-4 hours" | "1 day" | "1 week+";

export type ViewId = "home" | "log" | "stack" | "newsletter" | "about";

export interface ShippingLog {
  id: string;
  title: string;
  goal: string;
  techStack: string;
  wall: string;
  pivot: string;
  metric: string;
  status: LogStatus;
  toolStack: string; // comma-separated
  timeSpent: TimeBucket;
  createdAt: string; // ISO date
  // optional demo kind key (e.g. "bluevibe"); when set, the log detail renders
  // an embedded interactive demo + an external "view the build" link.
  demo?: string | null;
}

// Shape returned by /api/logs (toolStack split into array)
export interface ShippingLogDTO {
  id: string;
  title: string;
  goal: string;
  techStack: string;
  wall: string;
  pivot: string;
  metric: string;
  status: LogStatus;
  tools: string[];
  timeSpent: TimeBucket;
  createdAt: string;
  demo?: string | null;
}

export const STATUS_ORDER: LogStatus[] = [
  "IN_PROGRESS",
  "SHIPPED",
  "PIVOTED",
  "FAILED",
];

export const STATUS_META: Record<
  LogStatus,
  { label: string; tone: string; dot: string }
> = {
  SHIPPED: {
    label: "SHIPPED",
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  FAILED: {
    label: "FAILED",
    tone: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
    dot: "bg-rose-500",
  },
  PIVOTED: {
    label: "PIVOTED",
    tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    tone: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/30",
    dot: "bg-zinc-400",
  },
};

export const TIME_BUCKETS: TimeBucket[] = [
  "< 1 hour",
  "1-4 hours",
  "1 day",
  "1 week+",
];

// ---------------------------------------------------------------------------
// NEWSLETTER — "The Friday Log Dump"
// ---------------------------------------------------------------------------
// A rendered newsletter issue, generated server-side from the latest shipping
// log entry. This is the email content format made real (Option B architecture:
// the API route collects emails + renders the weekly issue from the log).
export interface NewsletterIssue {
  issue: number; // issue number (broadcast count + 1)
  subject: string; // "Log #05: <hook>"
  tldr: string; // 1-2 sentence summary
  goal: string;
  stack: string;
  status: string; // "[STATUS: PIVOTED]"
  broke: string; // the wall — "The Part That Broke"
  workaround: string; // the pivot — "The Boring Workaround"
  links: { site: string; repo: string | null };
  logId: string;
  logTitle: string;
  subscriberCount: number; // verified subscribers (the broadcast audience)
  totalSubscribers: number; // including unverified — for the UI
  alreadySent: boolean; // true if a broadcast already exists for this logId
}

export interface Broadcast {
  id: string;
  issue: number;
  subject: string;
  logId: string;
  logTitle: string;
  recipientCount: number;
  sentAt: string; // ISO
}
