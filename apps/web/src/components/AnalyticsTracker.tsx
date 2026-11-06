"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Non-intrusive, privacy-preserving telemetry
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagePath: pathname,
          interactionType: "page_view",
          referrer: document.referrer || null,
        }),
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
