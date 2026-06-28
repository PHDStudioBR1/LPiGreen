"use client";

import { useEffect } from "react";

type SegmentPageViewProps = {
  track: () => void;
};

export function SegmentPageView({ track }: SegmentPageViewProps) {
  useEffect(() => {
    track();
  }, [track]);

  return null;
}
