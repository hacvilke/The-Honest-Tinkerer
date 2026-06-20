import type { ComponentType } from "react";
import { BLUEVIBE_DEMO, type DemoMeta } from "@/lib/content";
import { BlueVibeDemo } from "@/components/demos/bluevibe-demo";

export interface DemoEntry {
  meta: DemoMeta;
  Component: ComponentType;
}

/**
 * Maps a log entry's `demo` kind to its interactive component + metadata.
 * Add new demos here as the log grows.
 */
export const DEMO_REGISTRY: Record<string, DemoEntry> = {
  [BLUEVIBE_DEMO.kind]: { meta: BLUEVIBE_DEMO, Component: BlueVibeDemo },
};

export function getDemo(kind?: string | null): DemoEntry | null {
  if (!kind) return null;
  return DEMO_REGISTRY[kind] ?? null;
}
