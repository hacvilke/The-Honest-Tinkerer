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
            <button
              onClick={() => setView("admin")}
              className="text-left text-sm text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              Admin
            </button>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground/70">
            {FOOTER.built}
          </p>
          <a
            href="https://app.netlify.com/projects/the-honest-tinkerer/deploys"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <img
              src="https://api.netlify.com/api/v1/badges/6f42d995-9b08-41bd-a584-ea470a878826/deploy-status"
              alt="Netlify deploy status"
              className="h-5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
