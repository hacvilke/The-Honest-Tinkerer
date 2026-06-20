"use client";

import { useEffect, useState } from "react";
import { Wrench, Menu } from "lucide-react";
import { useViewStore } from "@/lib/store";
import { NAV_LINKS } from "@/lib/content";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function SiteNav() {
  const view = useViewStore((s) => s.view);
  const setView = useViewStore((s) => s.setView);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-shadow",
        scrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <button
          onClick={() => setView("home")}
          className="group flex items-center gap-2.5"
          aria-label="The Honest Tinkerer — home"
        >
          <span className="flex size-7 items-center justify-center rounded-md border border-border bg-muted/50 text-foreground transition-colors group-hover:bg-muted">
            <Wrench className="size-3.5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">
              The Honest Tinkerer
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              in the trenches
            </span>
          </span>
        </button>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.id}
              variant="ghost"
              size="sm"
              onClick={() => setView(link.id)}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                view === link.id && "text-foreground"
              )}
            >
              {link.label}
              {view === link.id && (
                <span className="ml-1 size-1.5 rounded-full bg-amber-500" />
              )}
            </Button>
          ))}
          <div className="mx-1 h-5 w-px bg-border" />
          <ThemeToggle />
        </nav>

        {/* mobile: theme toggle + sheet */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Wrench className="size-4" /> The Honest Tinkerer
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.id}>
                    <Button
                      variant={view === link.id ? "secondary" : "ghost"}
                      onClick={() => setView(link.id)}
                      className="justify-start"
                    >
                      {link.label}
                    </Button>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
