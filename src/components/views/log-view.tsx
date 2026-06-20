"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Filter,
  RotateCcw,
  Inbox,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
} from "lucide-react";
import { SEED_LOGS } from "@/lib/content";
import {
  STATUS_ORDER,
  STATUS_META,
  TIME_BUCKETS,
  type LogStatus,
  type TimeBucket,
  type ShippingLogDTO,
} from "@/lib/types";
import { useLogs } from "@/hooks/use-logs";
import { getDemo } from "@/lib/demo-registry";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TOOL_OPTIONS = Array.from(
  new Set(
    SEED_LOGS.flatMap((l) =>
      l.toolStack.split(",").map((s) => s.trim()).filter(Boolean)
    )
  )
).sort();

const STATUS_CHIPS: { id: "all" | LogStatus; label: string }[] = [
  { id: "all", label: "All" },
  ...STATUS_ORDER.map((s) => ({ id: s, label: STATUS_META[s].label })),
];

/** A single row in the left index list. */
function LogListItem({
  log,
  active,
  onClick,
}: {
  log: ShippingLogDTO;
  active: boolean;
  onClick: () => void;
}) {
  const meta = STATUS_META[log.status];
  return (
    <button
      onClick={onClick}
      aria-current={active}
      className={cn(
        "group w-full border-l-2 px-3 py-3 text-left transition-colors",
        active
          ? "border-amber-500 bg-accent/60"
          : "border-transparent hover:bg-accent/40"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={cn("size-1.5 rounded-full", meta.dot)} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {meta.label}
          </span>
        </div>
        <time className="font-mono text-[10px] text-muted-foreground/80">
          {format(new Date(log.createdAt), "MMM d")}
        </time>
      </div>
      <p
        className={cn(
          "mt-1.5 line-clamp-2 text-sm font-medium leading-snug tracking-tight",
          active ? "text-foreground" : "text-foreground/80"
        )}
      >
        {log.title}
      </p>
      <div className="mt-1.5 flex items-center gap-1">
        {log.tools.slice(0, 2).map((t) => (
          <span
            key={t}
            className="rounded bg-muted px-1 py-0.5 font-mono text-[9px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
        {log.tools.length > 2 && (
          <span className="font-mono text-[9px] text-muted-foreground/60">
            +{log.tools.length - 2}
          </span>
        )}
        {log.demo && (
          <span className="ml-auto flex items-center gap-0.5 font-mono text-[9px] text-amber-600 dark:text-amber-500">
            <Play className="size-2.5" /> demo
          </span>
        )}
      </div>
    </button>
  );
}

/** An expanded, labelled field in the detail pane. */
function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-amber-600 dark:text-amber-500/90">
        {label}
      </p>
      <p className="text-pretty text-base leading-relaxed text-foreground/90 sm:text-[17px]">
        {children}
      </p>
    </div>
  );
}

export function LogView() {
  const [status, setStatus] = useState<LogStatus | null>(null);
  const [tool, setTool] = useState<string | null>(null);
  const [time, setTime] = useState<TimeBucket | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const filters = { status, tool, time };
  const { data, isLoading, isError, refetch, isFetching } = useLogs(filters);

  const hasFilters = Boolean(status || tool || time);
  const reset = () => {
    setStatus(null);
    setTool(null);
    setTime(null);
  };

  const count = data?.length ?? 0;

  // Derive the effective selection during render (no effect needed): if the
  // selected id isn't in the current (filtered) data, fall back to the first
  // entry on desktop, and to none on mobile so the list shows first. This
  // keeps the highlight + detail consistent with whatever the query returned.
  const selected = useMemo(
    () => data?.find((l) => l.id === selectedId) ?? null,
    [data, selectedId]
  );
  const effectiveSelected =
    selected ?? (isMobile ? null : data?.[0] ?? null);

  const selectedIndex = effectiveSelected
    ? data?.findIndex((l) => l.id === effectiveSelected.id) ?? -1
    : -1;
  const canPrev = selectedIndex > 0;
  const canNext = selectedIndex >= 0 && selectedIndex < (data?.length ?? 0) - 1;

  const intro = useMemo(
    () =>
      "A public diary of builds, dead ends, and the occasional thing that shipped. Tap an entry on the left to read the full wall, the pivot, and — when there's a demo — the thing that actually got built.",
    []
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
      {/* header */}
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500">
          The Shipping Log
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Broken builds &amp; minor victories
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {intro}
        </p>
      </header>

      {/* filter bar */}
      <div className="mt-6 rounded-xl border border-border/70 bg-card/60 p-3 sm:p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <Filter className="size-3" /> Status
            </span>
            {STATUS_CHIPS.map((chip) => {
              const active =
                chip.id === "all" ? status === null : status === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() =>
                    setStatus(chip.id === "all" ? null : (chip.id as LogStatus))
                  }
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-foreground/30 bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {chip.id !== "all" && (
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        STATUS_META[chip.id as LogStatus].dot
                      )}
                    />
                  )}
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={tool ?? "all"}
              onValueChange={(v) => setTool(v === "all" ? null : v)}
            >
              <SelectTrigger size="sm" className="w-[150px]">
                <SelectValue placeholder="Tool stack" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tools</SelectItem>
                {TOOL_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={time ?? "all"}
              onValueChange={(v) =>
                setTime(v === "all" ? null : (v as TimeBucket))
              }
            >
              <SelectTrigger size="sm" className="w-[150px]">
                <SelectValue placeholder="Time spent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any time</SelectItem>
                {TIME_BUCKETS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                className="text-muted-foreground"
              >
                <RotateCcw className="size-3.5" /> Reset
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {isLoading || isFetching
              ? "querying the log…"
              : `${count} ${count === 1 ? "entry" : "entries"} found`}
          </p>
          <span className="font-mono text-[11px] text-muted-foreground/70">
            sorted: newest first
          </span>
        </div>
      </div>

      {/* master / detail split */}
      <div className="mt-6 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-6">
        {/* ---- LEFT: index list ---- */}
        <aside
          className={cn(
            "rounded-xl border border-border/70 bg-card/40",
            effectiveSelected && isMobile ? "hidden" : "block"
          )}
        >
          <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Entries
            </p>
            <span className="font-mono text-[11px] text-muted-foreground/70">
              {count}
            </span>
          </div>

          <div className="max-h-[70vh] overflow-y-auto scroll-tinker lg:max-h-[calc(100vh-20rem)]">
            {isLoading ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            ) : isError ? (
              <div className="p-4 text-center">
                <p className="text-sm text-rose-600 dark:text-rose-400">
                  The log didn&apos;t load.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => refetch()}
                >
                  Try again
                </Button>
              </div>
            ) : count === 0 ? (
              <div className="p-6 text-center">
                <Inbox className="mx-auto size-5 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No builds match those filters.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={reset}
                >
                  <RotateCcw className="size-3.5" /> Clear
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {data.map((log) => (
                  <LogListItem
                    key={log.id}
                    log={log}
                    active={log.id === effectiveSelected?.id}
                    onClick={() => setSelectedId(log.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ---- RIGHT: expanded detail ---- */}
        <section
          className={cn(
            "mt-4 lg:mt-0",
            !effectiveSelected && isMobile ? "hidden" : "block"
          )}
        >
          {/* mobile back button */}
          {isMobile && effectiveSelected && (
            <Button
              variant="ghost"
              size="sm"
              className="mb-3 -ml-2 text-muted-foreground"
              onClick={() => setSelectedId(null)}
            >
              <ArrowLeft className="size-4" /> Back to log
            </Button>
          )}

          {!effectiveSelected ? (
            <div className="rounded-xl border border-dashed border-border bg-card/30 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Pick an entry on the left to read the full story.
              </p>
            </div>
          ) : (
            <LogDetail
              log={effectiveSelected}
              canPrev={canPrev}
              canNext={canNext}
              onPrev={() =>
                canPrev &&
                setSelectedId(data?.[selectedIndex - 1]?.id ?? null)
              }
              onNext={() =>
                canNext &&
                setSelectedId(data?.[selectedIndex + 1]?.id ?? null)
              }
            />
          )}
        </section>
      </div>
    </div>
  );
}

function LogDetail({
  log,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  log: ShippingLogDTO;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const meta = STATUS_META[log.status];
  const demo = getDemo(log.demo);

  return (
    <article className="rounded-xl border border-border/70 bg-card p-5 sm:p-7">
      {/* meta row */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("size-2 rounded-full", meta.dot)} />
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
          {format(new Date(log.createdAt), "MMM d, yyyy")}
        </time>
      </header>

      {/* title */}
      <h2 className="mt-5 text-pretty text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
        {log.title}
      </h2>

      {/* tools */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {log.tools.map((t) => (
          <span
            key={t}
            className="rounded border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      {/* fields */}
      <div className="mt-6 grid gap-5">
        <DetailField label="The Goal">{log.goal}</DetailField>
        <DetailField label="The Tech Stack">{log.techStack}</DetailField>
        <DetailField label="The Wall">{log.wall}</DetailField>
        <DetailField label="The Pivot / Fix">{log.pivot}</DetailField>
        <DetailField label="The Key Metric">{log.metric}</DetailField>
      </div>

      {/* embedded demo */}
      {demo && (
        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Play className="size-3.5 text-amber-600 dark:text-amber-500" />
            <h3 className="text-sm font-semibold tracking-tight">
              {demo.meta.title}
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              working demo
            </span>
          </div>
          <demo.Component />
        </div>
      )}

      {/* prev / next */}
      <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-4">
        <Button
          variant="ghost"
          size="sm"
          disabled={!canPrev}
          onClick={onPrev}
          className="text-muted-foreground"
        >
          <ChevronLeft className="size-4" /> Prev
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canNext}
          onClick={onNext}
          className="text-muted-foreground"
        >
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </article>
  );
}
