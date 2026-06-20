"use client";

import { useState } from "react";
import { ExternalLink, Heart, Send, Sparkles, AlertTriangle } from "lucide-react";
import { BLUEVIBE_DEMO, BLUEVIBE_SEED_POSTS, type BlueVibePost } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * BlueVibe — the embedded "working sub demo" for the vibe-coding log entry.
 *
 * A self-contained, interactive mock of the social feed that actually got
 * built before the over-engineering set in. No backend; all state is local.
 *
 * Deliberate warts (true to the story):
 *  - the like button fires twice per click (+2). This is a real bug from the
 *    build, surfaced as a feature.
 *  - a "drift" badge on posts the model invented without being asked.
 */
export function BlueVibeDemo() {
  const [posts, setPosts] = useState<BlueVibePost[]>(BLUEVIBE_SEED_POSTS);
  const [draft, setDraft] = useState("");
  const [vibeMeter, setVibeMeter] = useState(BLUEVIBE_SEED_POSTS.length);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  function publish() {
    const text = draft.trim();
    if (!text) return;
    const next: BlueVibePost = {
      id: Date.now(),
      author: "you",
      handle: "@you",
      initials: "YO",
      hue: 142,
      time: "now",
      text,
      likes: 0,
    };
    setPosts((prev) => [next, ...prev]);
    setDraft("");
    setVibeMeter((v) => v + 1);
  }

  // The "bug": a single click adds 2 likes. Documented, not fixed.
  function toggleLike(id: number) {
    setLiked((prev) => {
      const wasLiked = !!prev[id];
      const delta = wasLiked ? -2 : 2;
      setPosts((posts) =>
        posts.map((p) =>
          p.id === id ? { ...p, likes: Math.max(0, p.likes + delta) } : p
        )
      );
      return { ...prev, [id]: !wasLiked };
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      {/* app header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-amber-500 text-xs font-bold text-white">
            B
          </span>
          <div className="leading-none">
            <p className="text-sm font-semibold tracking-tight">BlueVibe</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              the next big thing (allegedly)
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-700 dark:text-amber-400">
          <Sparkles className="size-2.5" /> prototype
        </span>
      </div>

      {/* vibe meter */}
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          vibe meter
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-amber-500 transition-all duration-500"
            style={{ width: `${Math.min(100, vibeMeter * 12)}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {vibeMeter}
        </span>
      </div>

      {/* composer */}
      <div className="border-b border-border/60 p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              publish();
            }
          }}
          placeholder="what are you vibe-coding?"
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground/70">
            ⌘+Enter to post · no backend, no regrets
          </span>
          <button
            onClick={publish}
            disabled={!draft.trim()}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity disabled:opacity-40"
          >
            <Send className="size-3" /> Vibe post
          </button>
        </div>
      </div>

      {/* feed */}
      <div className="max-h-[420px] divide-y divide-border/50 overflow-y-auto scroll-tinker">
        {posts.map((post) => {
          const isLiked = !!liked[post.id];
          return (
            <article key={post.id} className="px-4 py-3">
              <div className="flex gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: `hsl(${post.hue} 65% 45%)` }}
                >
                  {post.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold">{post.author}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {post.handle}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {post.time}
                    </span>
                    {post.drift && (
                      <span className="flex items-center gap-1 rounded border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="size-2.5" /> drift
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-pretty text-sm leading-relaxed text-foreground/90">
                    {post.text}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={cn(
                        "flex items-center gap-1.5 text-xs transition-colors",
                        isLiked
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-pressed={isLiked}
                      aria-label={`Like post by ${post.author}`}
                    >
                      <Heart
                        className={cn("size-3.5", isLiked && "fill-current")}
                      />
                      {post.likes}
                      <span className="font-mono text-[9px] text-muted-foreground/60">
                        (×2 bug)
                      </span>
                    </button>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      reply (coming never)
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* footer: external link to the real build */}
      <div className="border-t border-border/60 bg-muted/30 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {BLUEVIBE_DEMO.caption}
          </p>
          <a
            href={BLUEVIBE_DEMO.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent"
          >
            Open the real build
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
