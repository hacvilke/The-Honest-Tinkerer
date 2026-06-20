"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { formatDateShort } from "@/lib/format-date";
import { STATUS_META, STATUS_ORDER, TIME_BUCKETS, type LogStatus, type TimeBucket } from "@/lib/types";
import { useViewStore } from "@/lib/store";
import {
  useAdminSession,
  useCreateLog,
  useDeleteLog,
  useAllLogs,
} from "@/hooks/use-admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AdminView() {
  const { data: isAdmin, isLoading } = useAdminSession();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-24">
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return isAdmin ? <AdminDashboard /> : <LoginForm />;
}

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password, both.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Login failed.");
        return;
      }
      toast.success("In. The dashboard is yours.");
      // Reload to pick up the admin session cookie.
      setTimeout(() => window.location.reload(), 600);
    } catch {
      toast.error("Network hiccup. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-5 py-20 sm:py-28">
      <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-amber-600 dark:text-amber-500" />
          <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          The compose dashboard. Enter your admin email + password to add a new
          shipping log entry — which becomes the next Friday Log Dump issue.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <Input
            type="email"
            placeholder="admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="h-11"
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="h-11"
            disabled={loading}
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Checking…
              </>
            ) : (
              <>
                <ShieldCheck className="size-4" /> Unlock dashboard
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin dashboard (compose + entry list)
// ---------------------------------------------------------------------------

function AdminDashboard() {
  const setView = useViewStore((s) => s.setView);
  const create = useCreateLog();
  const del = useDeleteLog();
  const { data: logs, isLoading: logsLoading } = useAllLogs();

  // form state
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [techStack, setTechStack] = useState("");
  const [wall, setWall] = useState("");
  const [pivot, setPivot] = useState("");
  const [metric, setMetric] = useState("");
  const [status, setStatus] = useState<LogStatus>("SHIPPED");
  const [tools, setTools] = useState("");
  const [timeSpent, setTimeSpent] = useState<TimeBucket>("1-4 hours");

  function onPublish(e: React.FormEvent) {
    e.preventDefault();
    const toolsArr = tools
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (toolsArr.length === 0) {
      toast.error("Add at least one tool (comma-separated).");
      return;
    }
    create.mutate({
      title: title.trim(),
      goal: goal.trim(),
      techStack: techStack.trim(),
      wall: wall.trim(),
      pivot: pivot.trim(),
      metric: metric.trim(),
      status,
      tools: toolsArr,
      timeSpent,
    });
    // clear the form
    setTitle(""); setGoal(""); setTechStack(""); setWall(""); setPivot(""); setMetric(""); setTools("");
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setTimeout(() => window.location.reload(), 300);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500">
            Admin Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Compose the next issue
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground">
          <LogOut className="size-4" /> Log out
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* compose form */}
        <form onSubmit={onPublish} className="space-y-4 rounded-xl border border-border/70 bg-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            New shipping log entry
          </p>

          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What you tried to build" required />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LogStatus)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </select>
            </Field>
            <Field label="Time spent">
              <select
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value as TimeBucket)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {TIME_BUCKETS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Tools (comma-separated)">
            <Input value={tools} onChange={(e) => setTools(e.target.value)} placeholder="Google Sheets, Claude, Vibe Coding" required />
          </Field>

          <Field label="The Goal">
            <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="What I tried to build" rows={2} required />
          </Field>

          <Field label="The Tech Stack">
            <Textarea value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Why I chose these tools" rows={2} required />
          </Field>

          <Field label="The Wall (what broke)">
            <Textarea value={wall} onChange={(e) => setWall(e.target.value)} placeholder="Where it broke / what the AI couldn't fix" rows={3} required />
          </Field>

          <Field label="The Pivot / Fix">
            <Textarea value={pivot} onChange={(e) => setPivot(e.target.value)} placeholder="How I got around it (or why I abandoned it)" rows={3} required />
          </Field>

          <Field label="The Key Metric">
            <Textarea value={metric} onChange={(e) => setMetric(e.target.value)} placeholder="Time wasted vs. value shipped" rows={2} required />
          </Field>

          <Button type="submit" size="lg" className="w-full" disabled={create.isPending}>
            {create.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Publishing…
              </>
            ) : (
              <>
                <Plus className="size-4" /> Publish entry
              </>
            )}
          </Button>
          <p className="font-mono text-[11px] text-muted-foreground/70">
            Publishing makes this the newest log → the next newsletter issue
            auto-generates from it.
          </p>
        </form>

        {/* entry list + next-issue shortcut */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Next issue
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              The most recent entry becomes the next Friday Log Dump. Preview
              and send it from the Newsletter page.
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setView("newsletter")}>
              Go to newsletter <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              All entries ({logs?.length ?? 0})
            </p>
            <div className="mt-3 max-h-[60vh] space-y-1 overflow-y-auto scroll-tinker">
              {logsLoading ? (
                <Skeleton className="h-40 w-full rounded-md" />
              ) : !logs || logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No entries yet.</p>
              ) : (
                logs.map((log) => {
                  const meta = STATUS_META[log.status];
                  return (
                    <div
                      key={log.id}
                      className="flex items-start justify-between gap-2 rounded-md border border-border/40 p-2.5"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={cn("size-1.5 rounded-full", meta.dot)} />
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {meta.label}
                          </span>
                          <span className="flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground/70">
                            <Clock className="size-2.5" />{formatDateShort(log.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-sm font-medium">{log.title}</p>
                      </div>
                      <button
                        onClick={() => del.mutate(log.id)}
                        className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                        aria-label={`Delete ${log.title}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
