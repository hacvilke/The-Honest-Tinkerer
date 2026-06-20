"use client";

import { Wrench } from "lucide-react";
import { useViewStore } from "@/lib/store";
import { FOOTER, NAV_LINKS } from "@/lib/content";

export function SiteFooter() {
  const setView = useViewStore((s) => s.setView);

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md border border-border bg-background">
                <Wrench className="size-3" />
              </span>
              <span className="text-sm font-semibold">The Honest Tinkerer</span>
            </div>
            <p className="text-sm text-muted-foreground">{FOOTER.tagline}</p>
            <p className="font-mono text-xs text-muted-foreground/80">
              {FOOTER.note}
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Navigate
            </p>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => setView(link.id)}
                className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-border/60 pt-5">
          <p className="font-mono text-xs text-muted-foreground/70">
            {FOOTER.built}
          </p>
        </div>
      </div>
    </footer>
  );
}
