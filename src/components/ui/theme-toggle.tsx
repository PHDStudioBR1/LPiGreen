"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // ignore storage errors
  }

  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const isDark = theme === "dark";

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);

    const html = document.documentElement;
    if (initial === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "dark" || stored === "light") return;
      } catch {
        // ignore
      }
      setTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const ariaLabel = isDark
    ? "Alternar para modo claro"
    : "Alternar para modo escuro";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={ariaLabel}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full border shadow-md transition-all duration-300 ease-out",
        "hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        isDark
          ? "border-primary/70 bg-primary"
          : "border-gray-300 bg-gray-300"
      )}
    >
      <span className="sr-only">Alternar modo de cor</span>

      <span className="pointer-events-none flex h-full w-full items-center justify-between px-1.5 text-[0.65rem] font-medium">
        <span
          data-icon="sun"
          className={cn(
            "flex items-center justify-center text-yellow-400 transition-all duration-300 ease-out",
            isDark && "opacity-0 -translate-y-1 scale-75"
          )}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1.1a1 1 0 1 1 2 0V21a1 1 0 0 1-1 1Zm0-18a1 1 0 0 1-1-1V2.9a1 1 0 1 1 2 0V3a1 1 0 0 1-1 1Zm8 7h-1.1a1 1 0 1 1 0-2H20a1 1 0 1 1 0 2Zm-14 0H4a1 1 0 1 1 0-2h1.1a1 1 0 1 1 0 2Zm11.657 6.657a1 1 0 0 1-1.414 0l-.78-.78a1 1 0 0 1 1.415-1.415l.78.781a1 1 0 0 1 0 1.414Zm-9.9-9.9a1 1 0 0 1-1.414 0l-.78-.78A1 1 0 0 1 5.754 6l.78.781a1 1 0 0 1 0 1.414Zm9.9-1.414a1 1 0 0 1 0-1.414l.78-.78A1 1 0 1 1 20.536 6l-.78.781a1 1 0 0 1-1.414 0Zm-9.9 9.9a1 1 0 0 1 0-1.414l.78-.78a1 1 0 0 1 1.415 1.414l-.781.78a1 1 0 0 1-1.414 0Z"
            />
          </svg>
        </span>

        <span
          data-icon="moon"
          className={cn(
            "flex items-center justify-center text-slate-100 opacity-0 -translate-y-1 scale-75 transition-all duration-300 ease-out",
            isDark && "opacity-100 translate-y-0 scale-100"
          )}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21 13.35A9 9 0 0 1 11.65 3a7 7 0 1 0 9.35 10.35Zm-2.22 2.57A9 9 0 0 1 8.08 5.57 7 7 0 1 0 18.78 15.92Z"
            />
          </svg>
        </span>
      </span>

      <span
        className={cn(
          "pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-300 ease-out",
          isDark && "translate-x-6"
        )}
      />
    </button>
  );
}

