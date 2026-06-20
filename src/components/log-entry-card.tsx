"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { formatDate } from "@/lib/format-date";
import type { ShippingLogDTO } from "@/lib/types";
import { STATUS_META } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LogEntryCardProps {
  log: ShippingLogDTO;
  variant?: "compact" | "full";
  onOpen?: () => void;
}

/** A labelled changelog field: mono label + body text, like a markdown doc. */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-foreground/90">{children}</p>
    </div>
  );
}

export function LogEntryCard({
  log,
  variant = "full",
  onOpen,
}: LogEntryCardProps) {
  const meta = STATUS_META[log.status];

  if (variant === "compact") {
    return (
      <button
        onClick={onOpen}
        className="group w-full rounded-lg border border-border/70 bg-card p-4 text-left transition-all hover:border-border hover:bg-accent/40"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={cn("size-1.5 rounded-full", meta.dot)} />
            <Badge
              variant="outline"
              className={cn("font-mono text-[10px] tracking-wide", meta.tone)}
            >
              [STATUS: {meta.label}]
            </Badge>
          </div>
          <time className="font-mono text-xs text-muted-foreground">
            {formatDate(log.createdAt)}
          </time>
        </div>
        <h3 className="mt-3 text-sm font-semibold leading-snug tracking-tight">
          {log.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {log.metric}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {log.tools.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
            Read <ArrowUpRight className="size-3" />
          </span>
        </div>
      </button>
    );
  }

  return (
    <article className="rounded-lg border border-border/70 bg-card p-5 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <span className={cn("size-1.5 rounded-full", meta.dot)} />
          <Badge
            variant="outline"
            className={cn("font-mono text-[10px] tracking-wide", meta.tone)}
          >
            [STATUS: {meta.label}]
          </Badge>
          <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <Clock className="size-3" />
            {log.timeSpent}
          </span>
        </div>
        <time className="font-mono text-xs text-muted-foreground">
          {formatDate(log.createdAt)}
        </time>
      </header>

      <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">
        {log.title}
      </h3>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {log.tools.map((t) => (
          <span
            key={t}
            className="rounded border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4">
        <Field label="The Goal">{log.goal}</Field>
        <Field label="The Tech Stack">{log.techStack}</Field>
        <Field label="The Wall">{log.wall}</Field>
        <Field label="The Pivot / Fix">{log.pivot}</Field>
        <Field label="The Key Metric">{log.metric}</Field>
      </div>
    </article>
  );
}
