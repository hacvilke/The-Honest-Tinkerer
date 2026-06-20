"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  Archive,
  ExternalLink,
  Lightbulb,
  Skull,
  Newspaper,
} from "lucide-react";
import { toast } from "sonner";
import { NEWSLETTER, CTA } from "@/lib/content";
import { useNewsletterLatest, useBroadcasts, useSendBroadcast } from "@/hooks/use-newsletter";
import { useViewStore } from "@/lib/store";
import { SubscribeForm } from "@/components/subscribe-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/** A labelled row in the email body, matching the Friday Log Dump format. */
function EmailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-500/90">
        {label}
      </p>
      <p className="text-pretty text-sm leading-relaxed text-foreground/90">
        {children}
      </p>
    </div>
  );
}

export function NewsletterView() {
  const setView = useViewStore((s) => s.setView);
  const { data: issue, isLoading, isError } = useNewsletterLatest();
  const { data: broadcasts } = useBroadcasts();
  const send = useSendBroadcast();

  // Detect the ?verified=1 redirect that the /api/verify endpoint sends after
  // a subscriber clicks their verification link, and toast the result.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const v = params.get("verified");
    if (v === "1") {
      const already = params.get("already") === "1";
      toast.success(
        already
          ? "Your inbox was already verified — nothing left to do."
          : "Inbox verified. You'll get the next Friday Log Dump."
      );
    } else if (v === "0") {
      toast.error("That verification link is invalid or expired.");
    }
    if (v !== null) {
      // Strip the query so the toast doesn't re-fire on later navigation.
      const cleanUrl =
        window.location.origin + window.location.pathname + window.location.hash;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, []);

  function onSend() {
    send.mutate(undefined, {
      onSuccess: (data) => {
        if (data.alreadySent) {
          toast.info(
            `Issue #${String(data.broadcast.issue).padStart(2, "0")} was already sent — no double-send.`
          );
        } else if (data.delivered) {
          toast.success(
            `Issue #${String(data.broadcast.issue).padStart(2, "0")} delivered to ${data.broadcast.recipientCount} ${data.broadcast.recipientCount === 1 ? "inbox" : "inboxes"} via Gmail SMTP.`
          );
        } else {
          toast.success(
            `Issue #${String(data.broadcast.issue).padStart(2, "0")} recorded (SMTP not configured — simulated send).`
          );
        }
      },
      onError: (e: Error) => toast.error(e.message),
    });
  }

  return (
    <div>
      {/* header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid pointer-events-none absolute inset-0 h-full" />
        <div className="relative mx-auto w-full max-w-4xl px-5 py-16 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500">
            {NEWSLETTER.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {NEWSLETTER.title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            {NEWSLETTER.intro}
          </p>
          <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground/80">
            {NEWSLETTER.stackNote}
          </p>
        </div>
      </section>

      {/* subscribe + this week's issue */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:py-16">
          {/* subscribe */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                01 — Subscribe
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                {CTA.title}
              </h2>
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

            {/* subscriber count + status */}
            <div className="rounded-xl border border-border/70 bg-card p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                The list, right now
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight tabular-nums">
                  {issue?.subscriberCount ?? 0}
                </span>
                <span className="mb-1 text-sm text-muted-foreground">
                  {issue?.subscriberCount === 1 ? "verified" : "verified"}
                </span>
              </div>
              {issue && issue.totalSubscribers > issue.subscriberCount && (
                <p className="mt-1 font-mono text-xs text-amber-600 dark:text-amber-500">
                  +{issue.totalSubscribers - issue.subscriberCount} pending
                  verification
                </p>
              )}
              <p className="mt-3 text-sm text-muted-foreground">
                Double opt-in: new subscribers click a verification link before
                they get the Friday log. Hitting Send delivers the issue to
                every <span className="font-medium text-foreground/80">verified</span> inbox via Gmail SMTP — real delivery, no spam.
              </p>
              {issue && (
                <div className="mt-4 border-t border-border/60 pt-3">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Next issue
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    #{String(issue.issue).padStart(2, "0")} — {issue.logTitle}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* this week's issue — live email preview */}
          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  02 — This week&apos;s draft
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  The Friday Log Dump, rendered live
                </h2>
              </div>
              {issue && (
                <Button
                  onClick={onSend}
                  disabled={send.isPending || issue.alreadySent}
                >
                  {send.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Sending…
                    </>
                  ) : issue.alreadySent ? (
                    <>
                      <CheckCircle2 className="size-4" /> Already sent
                    </>
                  ) : (
                    <>
                      <Send className="size-4" /> Send issue #
                      {String(issue.issue).padStart(2, "0")}
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="mt-5">
              {isLoading ? (
                <Skeleton className="h-[28rem] w-full rounded-xl" />
              ) : isError || !issue ? (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-6 text-sm text-rose-700 dark:text-rose-400">
                  The latest issue didn&apos;t render. Publish a shipping log
                  first.
                </div>
              ) : (
                <EmailPreview issue={issue} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* broadcast archive */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:py-16">
          <div className="flex items-center gap-2">
            <Archive className="size-4 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-semibold tracking-tight">
              The outbox — sent issues
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Every issue ever &quot;sent&quot;, newest first. In production
            this is where delivery metadata from Resend would land.
          </p>

          <div className="mt-6 space-y-2">
            {!broadcasts ? (
              <Skeleton className="h-16 w-full rounded-lg" />
            ) : broadcasts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No issues sent yet. Hit &quot;Send&quot; above.
              </div>
            ) : (
              broadcasts.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-card p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-500">
                        #{String(b.issue).padStart(2, "0")}
                      </span>
                      <span className="truncate text-sm font-medium">
                        {b.subject}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      from: {b.logTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="font-mono text-sm font-semibold tabular-nums">
                        {b.recipientCount}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        sent to
                      </p>
                    </div>
                    <time className="font-mono text-xs text-muted-foreground">
                      {format(new Date(b.sentAt), "MMM d, yyyy")}
                    </time>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* growth + golden rule */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:py-16">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-semibold tracking-tight">
              {NEWSLETTER.growth.title}
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            {NEWSLETTER.growth.body}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {NEWSLETTER.growth.tactics.map((t, i) => {
              const Icon =
                i === 0 ? Mail : i === 1 ? Skull : Newspaper;
              return (
                <div
                  key={t.title}
                  className="rounded-lg border border-border/70 bg-card p-5"
                >
                  <Icon className="size-4 text-amber-600 dark:text-amber-500" />
                  <h3 className="mt-3 text-sm font-semibold tracking-tight">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-xl border-l-2 border-amber-500 bg-muted/40 py-5 pl-5 pr-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber-600 dark:text-amber-500">
              {NEWSLETTER.goldenRule.title}
            </p>
            <p className="mt-2 text-pretty text-base font-medium leading-relaxed text-foreground">
              {NEWSLETTER.goldenRule.body}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setView("log")}>
              Read the shipping log
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

/** A faux email-client preview of the rendered Friday Log Dump issue. */
function EmailPreview({ issue }: { issue: import("@/lib/types").NewsletterIssue }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      {/* email client chrome */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-rose-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Mail className="size-3" />
          inbox — The Honest Tinkerer
        </span>
        {issue.alreadySent && (
          <Badge
            variant="outline"
            className="ml-auto border-emerald-500/30 bg-emerald-500/10 font-mono text-[10px] text-emerald-700 dark:text-emerald-400"
          >
            <CheckCircle2 className="size-3" /> sent
          </Badge>
        )}
      </div>

      {/* email header */}
      <div className="border-b border-border/60 px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Subject
        </p>
        <p className="mt-1 text-base font-semibold tracking-tight">
          {issue.subject}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>
            From:{" "}
            <span className="text-foreground/80">The Honest Tinkerer</span>
          </span>
          <span>·</span>
          <span>To: {issue.subscriberCount} subscribers</span>
          <span>·</span>
          <span>Issue #{String(issue.issue).padStart(2, "0")}</span>
        </div>
      </div>

      {/* email body */}
      <div className="space-y-4 px-5 py-5">
        <EmailField label="The TL;DR">{issue.tldr}</EmailField>

        <div className="space-y-2 border-t border-border/40 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            What I Built
          </p>
          <EmailField label="The Goal">{issue.goal}</EmailField>
          <EmailField label="The Stack">{issue.stack}</EmailField>
          <EmailField label="Status">
            <span className="font-mono">{issue.status}</span>
          </EmailField>
        </div>

        <EmailField label="The Part That Broke (The Reality Check)">
          {issue.broke}
        </EmailField>
        <EmailField label="The Boring Workaround">
          {issue.workaround}
        </EmailField>

        {/* tinkerer links */}
        <div className="space-y-2 border-t border-border/40 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Tinkerer Links
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>
              <a
                href={issue.links.site}
                className="inline-flex items-center gap-1 text-amber-600 underline-offset-2 hover:underline dark:text-amber-500"
              >
                Read the full post on the site
                <ExternalLink className="size-3" />
              </a>
            </li>
            <li>
              {issue.links.repo ? (
                <a
                  href={issue.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-600 underline-offset-2 hover:underline dark:text-amber-500"
                >
                  Check out the live build (dead-end repo)
                  <ExternalLink className="size-3" />
                </a>
              ) : (
                <span className="text-muted-foreground">
                  No public repo — it was a dead end, that&apos;s the point.
                </span>
              )}
            </li>
          </ul>
        </div>

        <p className="border-t border-border/40 pt-4 font-mono text-[11px] text-muted-foreground/70">
          The Honest Tinkerer · written while still annoyed · unsubscribe by
          ignoring me, like a normal person
        </p>
      </div>
    </div>
  );
}
