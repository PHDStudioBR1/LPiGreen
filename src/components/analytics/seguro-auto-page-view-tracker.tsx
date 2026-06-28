"use client";

import { SegmentPageView } from "@/components/analytics/segment-page-view";
import { trackSeguroAutoPageView } from "@/lib/seguro-auto/analytics";

export function SeguroAutoPageViewTracker() {
  return <SegmentPageView track={trackSeguroAutoPageView} />;
}
