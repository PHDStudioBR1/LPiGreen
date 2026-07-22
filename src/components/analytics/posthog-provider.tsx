"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

let initialized = false;

function initPostHog() {
  if (initialized || !POSTHOG_KEY || typeof window === "undefined") return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // defaults recent → pageviews via history_change (App Router SPA)
    defaults: "2025-05-24",
    person_profiles: "identified_only",
    capture_pageleave: true,
    loaded: (client) => {
      // Garante global para debug/QA
      (window as Window & { posthog?: typeof posthog }).posthog = client;
    },
  });

  initialized = true;
}

/**
 * PostHog project 522696 — init no client + pageview em soft navigations.
 * Sem NEXT_PUBLIC_POSTHOG_KEY o componente é no-op.
 */
export function PostHogProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (!POSTHOG_KEY || pathname?.startsWith("/admin")) return;
    initPostHog();
  }, [pathname]);

  useEffect(() => {
    if (!POSTHOG_KEY || !initialized || pathname?.startsWith("/admin")) return;
    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [pathname]);

  return null;
}
