"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "seguros-exit-intent-dismissed";

function hasSeenExitIntent(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markExitIntentSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore
  }
}

export function useExitIntent() {
  const [show, setShow] = useState(false);
  const seenRef = useRef(false);

  useEffect(() => {
    if (hasSeenExitIntent()) {
      seenRef.current = true;
      return;
    }

    const onMouseLeave = (e: MouseEvent) => {
      if (seenRef.current || e.clientY > 0) return;
      seenRef.current = true;
      markExitIntentSeen();
      setShow(true);
    };

    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, []);

  const dismiss = useCallback(() => {
    seenRef.current = true;
    markExitIntentSeen();
    setShow(false);
  }, []);

  return { show, dismiss, setShow };
}
