"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewsletterIssue, Broadcast } from "@/lib/types";

export function useNewsletterLatest() {
  return useQuery({
    queryKey: ["newsletter-latest"],
    queryFn: async () => {
      const res = await fetch("/api/newsletter/latest");
      if (!res.ok) throw new Error("Failed to render the latest issue");
      const data = (await res.json()) as { issue: NewsletterIssue };
      return data.issue;
    },
  });
}

export function useBroadcasts() {
  return useQuery({
    queryKey: ["newsletter-broadcasts"],
    queryFn: async () => {
      const res = await fetch("/api/newsletter/broadcasts");
      if (!res.ok) throw new Error("Failed to load the archive");
      const data = (await res.json()) as { broadcasts: Broadcast[] };
      return data.broadcasts;
    },
  });
}

export function useSendBroadcast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/newsletter/broadcast", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Send failed");
      return data as {
        ok: boolean;
        alreadySent?: boolean;
        delivered?: boolean;
        messageId?: string;
        broadcast: Broadcast;
      };
    },
    onSuccess: (data) => {
      // The latest issue is now "already sent" + the archive grew.
      qc.invalidateQueries({ queryKey: ["newsletter-latest"] });
      qc.invalidateQueries({ queryKey: ["newsletter-broadcasts"] });
      void data;
    },
  });
}
