"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useViewStore } from "@/lib/store";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { HomeView } from "@/components/views/home-view";
import { LogView } from "@/components/views/log-view";
import { StackView } from "@/components/views/stack-view";
import { NewsletterView } from "@/components/views/newsletter-view";
import { AdminView } from "@/components/views/admin-view";
import { AboutView } from "@/components/views/about-view";

export default function Home() {
  const view = useViewStore((s) => s.view);
  const hydrate = useViewStore((s) => s.hydrateFromHash);

  useEffect(() => {
    hydrate();
    const onPop = () => hydrate();
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onPop);
    };
  }, [hydrate]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow-md focus:border focus:border-border"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main" className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {view === "home" && <HomeView />}
            {view === "log" && <LogView />}
            {view === "stack" && <StackView />}
            {view === "newsletter" && <NewsletterView />}
            {view === "admin" && <AdminView />}
            {view === "about" && <AboutView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
    </div>
  );
}
