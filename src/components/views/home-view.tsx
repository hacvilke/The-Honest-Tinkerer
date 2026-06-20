"use client";

import { ArrowRight, Terminal, Quote } from "lucide-react";
import { formatDateLog } from "@/lib/format-date";
import { useViewStore } from "@/lib/store";
import { HERO, MANIFESTO, CTA, SEED_LOGS } from "@/lib/content";
import { STATUS_META } from "@/lib/types";
import type { ShippingLogDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SubscribeForm } from "@/components/subscribe-form";
import { LogEntryCard } from "@/components/log-entry-card";
import { cn } from "@/lib/utils";

function toDTO(log: (typeof SEED_LOGS)[number]): ShippingLogDTO {
  return {
    ...log,
    tools: log.toolStack.split(",").map((s) => s.trim()).filter(Boolean),
  };
}

export function HomeView() {
  const setView = useViewStore((s) => s.setView);

  const recent = [...SEED_LOGS]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 3)
    .map(toDTO);

  const terminalLines = [...SEED_LOGS]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4)
    .map(toDTO);

  return (
    <div>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid pointer-events-none absolute inset-0 h-full" />
        <div className="relative mx-auto w-full max-w-4xl px-5 py-20 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500">
            {HERO.eyebrow}
          </p>
          <h1 className="mt-4 text-pretty text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {HERO.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {HERO.subhead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => setView("log")}>
              {HERO.primaryCta} <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setView("stack")}
            >
              {HERO.secondaryCta}
            </Button>
          </div>

          {/* faux terminal / changelog card */}
          <div className="mt-12 overflow-hidden rounded-xl border border-border/70 bg-muted/40 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/60 px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-rose-400/70" />
                <span className="size-2.5 rounded-full bg-amber-400/70" />
                <span className="size-2.5 rounded-full bg-emerald-400/70" />
              </span>
              <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Terminal className="size-3" />
                tail -n 4 shipping.log
              </span>
            </div>
            <div className="space-y-1.5 p-4 font-mono text-xs leading-relaxed sm:text-[13px]">
              {terminalLines.map((l) => {
                const meta = STATUS_META[l.status];
                return (
                  <div key={l.id} className="flex items-start gap-3">
                    <span className="shrink-0 text-muted-foreground">
                      {formatDateLog(l.createdAt)}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-semibold",
                        l.status === "SHIPPED" && "text-emerald-600 dark:text-emerald-400",
                        l.status === "FAILED" && "text-rose-600 dark:text-rose-400",
                        l.status === "PIVOTED" && "text-amber-600 dark:text-amber-500",
                        l.status === "IN_PROGRESS" && "text-zinc-500 dark:text-zinc-400"
                      )}
                    >
                      {meta.label.padEnd(10, " ")}
                    </span>
                    <span className="truncate text-foreground/80">
                      {l.title}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center gap-2 pt-1 text-muted-foreground">
                <span>$</span>
                <span className="cursor-blink inline-block h-3.5 w-2 bg-foreground/70" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- MANIFESTO */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {MANIFESTO.eyebrow}
          </p>
          <h2 className="mt-3 text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
            {MANIFESTO.title}
          </h2>
          <div className="mt-6 space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
            {MANIFESTO.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <figure className="mt-8 rounded-r-lg border-l-2 border-amber-500 bg-muted/40 py-4 pl-5 pr-4">
            <div className="flex gap-3">
              <Quote className="size-4 shrink-0 text-amber-500/70" />
              <blockquote className="text-pretty text-base font-medium leading-relaxed text-foreground">
                {MANIFESTO.pullQuote}
              </blockquote>
            </div>
          </figure>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {MANIFESTO.pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-lg border border-border/70 bg-card p-4"
              >
                <h3 className="text-sm font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- LATEST BUILDS */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Latest builds
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                The log, most recent first
              </h2>
            </div>
            <Button variant="ghost" onClick={() => setView("log")}>
              View full log <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((log) => (
              <LogEntryCard
                key={log.id}
                log={log}
                variant="compact"
                onOpen={() => setView("log")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section>
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:py-24">
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {CTA.title}
            </h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
              {CTA.body}
            </p>
            <div className="mt-6">
              <SubscribeForm />
            </div>
            <p className="mt-3 font-mono text-xs text-muted-foreground/80">
              {CTA.reassurance}
            </p>
            <div className="mt-4">
              <Button variant="link" className="h-auto p-0 text-amber-600 dark:text-amber-500" onClick={() => setView("newsletter")}>
                See how the newsletter actually works →
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
