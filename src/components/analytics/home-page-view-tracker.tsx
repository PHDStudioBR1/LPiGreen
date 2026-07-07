"use client";

import { SegmentPageView } from "@/components/analytics/segment-page-view";
import { trackHomePageView } from "@/lib/home/analytics";

export function HomePageViewTracker() {
  return <SegmentPageView track={trackHomePageView} />;
}
