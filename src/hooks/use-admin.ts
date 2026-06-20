"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ShippingLogDTO, LogStatus, TimeBucket } from "@/lib/types";

/** Check if the current session is an admin (cookie-based). */
export function useAdminSession() {
  return useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {
      const res = await fetch("/api/admin/session");
      if (!res.ok) throw new Error("Session check failed");
      const data = (await res.json()) as { admin: boolean };
      return data.admin;
    },
    retry: false,
  });
}

export interface NewLogEntry {
  title: string;
  goal: string;
  techStack: string;
  wall: string;
  pivot: string;
  metric: string;
  status: LogStatus;
  tools: string[];
  timeSpent: TimeBucket;
  demo?: string | null;
}

/** Create a new shipping log entry (becomes the next newsletter issue). */
export function useCreateLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: NewLogEntry) => {
      const res = await fetch("/api/admin/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Create failed");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logs"] });
      qc.invalidateQueries({ queryKey: ["newsletter-latest"] });
      toast.success("Entry published. It's now the next newsletter issue.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

/** Delete a shipping log entry. */
export function useDeleteLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/logs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Delete failed");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logs"] });
      qc.invalidateQueries({ queryKey: ["newsletter-latest"] });
      toast.success("Entry deleted.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

/** Fetch all shipping logs for the admin dashboard list. */
export function useAllLogs() {
  return useQuery({
    queryKey: ["logs", "all"],
    queryFn: async () => {
      const res = await fetch("/api/logs");
      if (!res.ok) throw new Error("Failed to load logs");
      const data = (await res.json()) as { logs: ShippingLogDTO[] };
      return data.logs;
    },
  });
}
