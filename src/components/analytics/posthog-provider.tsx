"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

/**
 * Garante $pageview em soft navigations do App Router.
 * O init principal fica em instrumentation-client.ts.
 */
export function PostHogProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    if (pathname?.startsWith("/admin")) return;
    if (typeof window === "undefined") return;

    if (!posthog.__loaded) return;

    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [pathname]);

  return null;
}
