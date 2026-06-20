"use client";

import { useQuery } from "@tanstack/react-query";
import type { ShippingLogDTO, LogStatus, TimeBucket } from "@/lib/types";

export interface LogFilters {
  status?: LogStatus | null;
  tool?: string | null;
  time?: TimeBucket | null;
}

export function useLogs(filters: LogFilters) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.tool) params.set("tool", filters.tool);
  if (filters.time) params.set("time", filters.time);
  const qs = params.toString();
  const url = `/api/logs${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["logs", filters.status ?? "", filters.tool ?? "", filters.time ?? ""],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load logs");
      const data = (await res.json()) as { logs: ShippingLogDTO[] };
      return data.logs;
    },
  });
}
