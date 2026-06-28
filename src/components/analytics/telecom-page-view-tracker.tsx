"use client";

import { SegmentPageView } from "@/components/analytics/segment-page-view";
import { trackTelecomPageView } from "@/lib/telecom/analytics";

export function TelecomPageViewTracker() {
  return <SegmentPageView track={trackTelecomPageView} />;
}
