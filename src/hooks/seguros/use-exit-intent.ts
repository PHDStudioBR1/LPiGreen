"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "seguros-exit-intent-dismissed";

export function useExitIntent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // ignore
    }

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return;
      setShow(true);
    };

    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  return { show, dismiss, setShow };
}
