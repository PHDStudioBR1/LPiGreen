"use client";

import { PostHogProvider } from "@/components/analytics/posthog-provider";

/** Client analytics bootstrap (sem Suspense/useSearchParams). */
export function PostHogAnalytics() {
  return <PostHogProvider />;
}
