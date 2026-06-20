"use client";

import { create } from "zustand";
import type { ViewId } from "@/lib/types";

interface ViewState {
  view: ViewId;
  setView: (view: ViewId, opts?: { replace?: boolean }) => void;
  hydrateFromHash: () => void;
}

const VALID: ViewId[] = ["home", "log", "stack", "newsletter", "admin", "about"];

function parseHash(): ViewId {
  if (typeof window === "undefined") return "home";
  const raw = window.location.hash.replace(/^#\/?/, "").trim() as ViewId;
  return VALID.includes(raw) ? raw : "home";
}

export const useViewStore = create<ViewState>((set) => ({
  view: "home",
  setView: (view, opts) => {
    set({ view });
    if (typeof window !== "undefined") {
      const target = `#/${view}`;
      if (opts?.replace) {
        window.history.replaceState(null, "", target);
      } else {
        window.history.pushState(null, "", target);
      }
      // jump to top on view change
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  },
  hydrateFromHash: () => {
    set({ view: parseHash() });
  },
}));
