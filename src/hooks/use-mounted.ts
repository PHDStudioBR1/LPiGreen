"use client";

import { useEffect, useState } from "react";

/** Evita hydration mismatch em componentes Radix (Accordion, Dialog, etc.). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
