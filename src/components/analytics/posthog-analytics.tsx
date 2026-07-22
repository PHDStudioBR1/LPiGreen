"use client";

import { Suspense } from "react";
import { PostHogProvider } from "@/components/analytics/posthog-provider";

/** Suspense boundary required by useSearchParams in App Router. */
export function PostHogAnalytics() {
  return (
    <Suspense fallback={null}>
      <PostHogProvider />
    </Suspense>
  );
}
