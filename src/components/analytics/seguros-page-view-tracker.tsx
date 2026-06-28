"use client";

import { SegmentPageView } from "@/components/analytics/segment-page-view";
import { trackSegurosPageView } from "@/lib/seguros/analytics";

export function SegurosPageViewTracker() {
  return <SegmentPageView track={trackSegurosPageView} />;
}
