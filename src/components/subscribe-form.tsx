"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CTA } from "@/lib/content";

interface SubscribeResult {
  ok?: boolean;
  error?: string;
  alreadySubscribed?: boolean;
  verified?: boolean; // already verified
  verificationSent?: boolean; // verification email sent
  smtpConfigured?: boolean;
}

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<SubscribeResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("An email would help. I can't send logs to a feeling.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json()) as SubscribeResult;
      if (!res.ok) {
        toast.error(data?.error ?? "Something broke. Try again in a moment.");
        return;
      }
      setResult(data);
      setDone(true);

      if (data.verified) {
        toast.success("You're already verified — first log ships Friday.");
      } else if (data.verificationSent) {
        toast.success("Check your inbox for a verification link.");
      } else if (data.smtpConfigured === false) {
        toast.info("Subscribed — SMTP isn't configured, so no verify email went out.");
      } else {
        toast.success("You're on the list.");
      }
      setEmail("");
    } catch {
      toast.error("Network hiccup. The inbox isn't going anywhere.");
    } finally {
      setLoading(false);
    }
  }

  if (done && result) {
    // Already verified → green check.
    if (result.verified) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          <MailCheck className="size-4" />
          You&apos;re verified — your inbox is on the list.
        </div>
      );
    }
    // Verification email sent (or attempted) → amber "check your inbox".
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
        <p className="font-medium">One more step: verify your inbox.</p>
        <p className="mt-1 text-amber-700/80 dark:text-amber-400/80">
          {result.verificationSent
            ? "A verification link just landed in your inbox. Click it to confirm — no Friday logs until you do."
            : "I tried to send a verification link. If it didn't arrive, try subscribing again in a minute."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "flex flex-col gap-2 sm:flex-row" : "flex flex-col gap-3 sm:flex-row"}
    >
      <Input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={CTA.placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
        className="h-11 flex-1 bg-background"
        disabled={loading}
      />
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="h-11 shrink-0"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          CTA.button
        )}
      </Button>
    </form>
  );
}
