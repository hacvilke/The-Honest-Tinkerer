"use client";

import { Quote, ArrowRight } from "lucide-react";
import { ABOUT, CTA } from "@/lib/content";
import { useViewStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SubscribeForm } from "@/components/subscribe-form";

export function AboutView() {
  const setView = useViewStore((s) => s.setView);

  return (
    <div>
      {/* header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid pointer-events-none absolute inset-0 h-full" />
        <div className="relative mx-auto w-full max-w-3xl px-5 py-16 sm:py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500">
            {ABOUT.eyebrow}
          </p>
          <h1 className="mt-3 text-pretty text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {ABOUT.title}
          </h1>
          <div className="mt-6 space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
            {ABOUT.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* why this works */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            Why a non-guru is the better read
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {ABOUT.whyThisWorks.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border/70 bg-card p-5"
              >
                <h3 className="text-sm font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <figure className="mt-8 rounded-r-lg border-l-2 border-amber-500 bg-muted/40 py-4 pl-5 pr-4">
            <div className="flex gap-3">
              <Quote className="size-4 shrink-0 text-amber-500/70" />
              <blockquote className="text-pretty text-base font-medium leading-relaxed text-foreground">
                There&apos;s no product at the end of this funnel. The
                figuring-out process IS the product.
              </blockquote>
            </div>
          </figure>
        </div>
      </section>

      {/* rules of engagement */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            {ABOUT.rulesTitle}
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            The guardrails that keep this site honest. If I break one, that&apos;s
            a bug in me, not in the rule.
          </p>

          <ol className="mt-8 space-y-4">
            {ABOUT.rules.map((r, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-lg border border-border/70 bg-card p-4 sm:p-5"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground font-mono text-xs font-semibold text-background">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-snug tracking-tight sm:text-base">
                    {r.rule}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {r.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* closing + CTA */}
      <section>
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:py-24">
          <p className="text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
            {ABOUT.closing}
          </p>

          <div className="mt-8 rounded-2xl border border-border/70 bg-muted/30 p-6 sm:p-8">
            <h3 className="text-xl font-semibold tracking-tight">
              {CTA.title}
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              {CTA.body}
            </p>
            <div className="mt-5">
              <SubscribeForm />
            </div>
            <p className="mt-3 font-mono text-xs text-muted-foreground/80">
              {CTA.reassurance}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setView("log")}>
              Read the shipping log
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="ghost" onClick={() => setView("stack")}>
              See the minimalist stack
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
