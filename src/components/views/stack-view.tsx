"use client";

import {
  Table2,
  FileText,
  Mail,
  Bot,
  Globe,
  Clock,
  Check,
  X,
  ArrowRight,
  Hammer,
} from "lucide-react";
import { BORING_BLUEPRINT, CUT_LIST, WORKFLOWS } from "@/lib/content";
import { useViewStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BLUEPRINT_ICONS = [Table2, FileText, Mail, Bot, Globe];

export function StackView() {
  const setView = useViewStore((s) => s.setView);

  return (
    <div>
      {/* header */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500">
            The Minimalist Stack
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Productivity over tool theater
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            This isn&apos;t a directory of forty-seven AI tools you&apos;ll
            never finish onboarding onto. It&apos;s the lean setup that
            actually gets me to &quot;shipped&quot; — built around Google
            Workspace and a single LLM, on purpose.
          </p>
        </div>
      </section>

      {/* boring blueprint */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-20">
          <div className="flex items-center gap-2">
            <Hammer className="size-4 text-amber-600 dark:text-amber-500" />
            <h2 className="text-2xl font-semibold tracking-tight">
              The Boring Blueprint
            </h2>
          </div>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            The foundational setup. Boring is better for shipping because
            boring doesn&apos;t break on a Sunday. Every item here has carried
            real weight in a real build.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {BORING_BLUEPRINT.map((item, i) => {
              const Icon = BLUEPRINT_ICONS[i] ?? Table2;
              return (
                <div
                  key={item.name}
                  className="flex flex-col rounded-lg border border-border/70 bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-md border border-border bg-muted/50">
                        <Icon className="size-4 text-foreground/80" />
                      </span>
                      <div>
                        <h3 className="font-semibold tracking-tight">
                          {item.name}
                        </h3>
                        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {item.why}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* the cut list */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight">The Cut List</h2>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Popular categories of tools I don&apos;t use — and the blunt reason
            each one is currently just noise for an early-stage builder. Nothing
            here is evil. Most of it is just premature.
          </p>

          <div className="mt-8 space-y-3">
            {CUT_LIST.map((item) => {
              const partial = item.verdict.includes("now");
              return (
                <div
                  key={item.category}
                  className="rounded-lg border border-border/70 bg-card p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold tracking-tight sm:text-base">
                      {item.category}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-mono text-[10px] tracking-wide",
                        partial
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                      )}
                    >
                      {partial ? (
                        <Clock className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                      {item.verdict}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* workflow blueprints */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            Workflow Blueprints
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Step-by-step recipes that stitch Google Workspace and AI together
            into a finished result in under 30 minutes — no complex backend, no
            new accounts, no YAML.
          </p>

          <div className="mt-8 space-y-5">
            {WORKFLOWS.map((wf, i) => (
              <div
                key={wf.title}
                className="overflow-hidden rounded-lg border border-border/70 bg-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-md bg-foreground font-mono text-xs font-semibold text-background">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold tracking-tight">{wf.title}</h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 font-mono text-[10px] text-amber-700 dark:text-amber-400"
                  >
                    <Clock className="size-3" /> ~{wf.minutes} min
                  </Badge>
                </div>

                <div className="px-5 py-5">
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      The Goal
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {wf.goal}
                    </p>
                  </div>

                  <ol className="mt-5 space-y-3">
                    {wf.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[10px] text-muted-foreground">
                          {idx + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-5 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      <Check className="mr-1 inline size-3" /> The Payoff
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                      {wf.payoff}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              That&apos;s the whole stack. Five tools, three workflows, and a
              policy of shipping before optimizing.
            </p>
            <Button className="mt-4" onClick={() => setView("log")}>
              See it in action — read the log
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
