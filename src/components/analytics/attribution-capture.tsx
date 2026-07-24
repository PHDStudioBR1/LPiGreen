"use client";

import { useEffect } from "react";
import { captureAttributionFromLocation } from "@/lib/attribution/utm";

/** Captura first-touch UTMs/fbclid/gclid da URL na sessionStorage. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttributionFromLocation();
  }, []);
  return null;
}
