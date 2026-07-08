"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  getMetaPageContext,
  trackMetaCustom,
} from "@/lib/analytics/meta-pixel";

const SCROLL_THRESHOLDS = [25, 50, 75, 90, 100] as const;
const TIME_THRESHOLDS = [10, 30, 60, 120] as const;

type MetaJourneyTrackerProps = {
  funnel: "seguros" | "seguro-auto";
  sectionIds: string[];
};

function isInteractiveTarget(el: Element | null): el is HTMLElement {
  if (!el || !(el instanceof HTMLElement)) return false;
  return Boolean(
    el.closest(
      "a, button, [role='button'], input[type='submit'], input[type='button'], .igf-btn, [data-meta-track]"
    )
  );
}

function resolveClickMeta(el: HTMLElement) {
  const target = el.closest(
    "a, button, [role='button'], input[type='submit'], input[type='button'], .igf-btn, [data-meta-track]"
  ) as HTMLElement | null;

  if (!target) return null;

  const text =
    (target.getAttribute("aria-label") ||
      target.getAttribute("data-meta-label") ||
      target.innerText ||
      (target as HTMLInputElement).value ||
      "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);

  const href = target instanceof HTMLAnchorElement ? target.href : "";
  const lowerHref = href.toLowerCase();
  const lowerText = text.toLowerCase();

  let clickType = "click";
  if (lowerHref.includes("wa.me") || lowerHref.includes("whatsapp") || lowerText.includes("whatsapp")) {
    clickType = "whatsapp";
  } else if (lowerHref.startsWith("tel:") || lowerText.includes("telefone")) {
    clickType = "phone";
  } else if (lowerHref.startsWith("mailto:") || lowerText.includes("e-mail") || lowerText.includes("email")) {
    clickType = "email";
  } else if (
    lowerText.includes("continuar") ||
    lowerText.includes("próximo") ||
    lowerText.includes("proximo") ||
    lowerText.includes("simular") ||
    lowerText.includes("enviar") ||
    lowerText.includes("cotar") ||
    lowerText.includes("cotação") ||
    lowerText.includes("cotacao") ||
    lowerText.includes("receber")
  ) {
    clickType = "cta";
  } else if (target.tagName === "A") {
    clickType = "link";
  } else if (target.closest("nav, header, [role='navigation']")) {
    clickType = "menu";
  } else if (target.closest("[data-card], .card, article")) {
    clickType = "card";
  } else {
    clickType = "button";
  }

  return {
    click_type: clickType,
    button_text: text || "(sem texto)",
    element_id: target.id || "",
    element_class: typeof target.className === "string" ? target.className.slice(0, 160) : "",
    href: href.slice(0, 300),
    tag: target.tagName.toLowerCase(),
  };
}

/**
 * Passive journey listeners: scroll depth, time on page, section views, relevant clicks.
 * Deduped via onceKey in meta-pixel helpers. Single listener set per mount.
 */
export function MetaJourneyTracker({ funnel, sectionIds }: MetaJourneyTrackerProps) {
  const pathname = usePathname() || "";
  const scrolledRef = useRef<Set<number>>(new Set());
  const timedRef = useRef<Set<number>>(new Set());
  const sectionsSeenRef = useRef<Set<string>>(new Set());
  const startedAtRef = useRef<number>(Date.now());
  const timersRef = useRef<number[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Reset session state on SPA path change within the segment
  useEffect(() => {
    scrolledRef.current = new Set();
    timedRef.current = new Set();
    sectionsSeenRef.current = new Set();
    startedAtRef.current = Date.now();

    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    TIME_THRESHOLDS.forEach((seconds) => {
      const id = window.setTimeout(() => {
        if (timedRef.current.has(seconds)) return;
        timedRef.current.add(seconds);
        const ctx = getMetaPageContext();
        trackMetaCustom(
          "TimeOnPage",
          {
            funnel,
            seconds,
            ...ctx,
          },
          { onceKey: `TimeOnPage:${ctx.page_path}:${seconds}` }
        );
      }, seconds * 1000);
      timersRef.current.push(id);
    });

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [pathname, funnel]);

  // Scroll depth
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const percent = Math.min(100, Math.round((window.scrollY / scrollHeight) * 100));

      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent < threshold || scrolledRef.current.has(threshold)) continue;
        scrolledRef.current.add(threshold);
        const ctx = getMetaPageContext();
        trackMetaCustom(
          "ScrollDepth",
          {
            funnel,
            percent: threshold,
            ...ctx,
          },
          { onceKey: `ScrollDepth:${ctx.page_path}:${threshold}` }
        );
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, funnel]);

  // Section visibility
  useEffect(() => {
    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (!id || sectionsSeenRef.current.has(id)) continue;
          sectionsSeenRef.current.add(id);
          const ctx = getMetaPageContext();
          trackMetaCustom(
            "SectionViewed",
            {
              funnel,
              section_id: id,
              ...ctx,
            },
            { onceKey: `SectionViewed:${ctx.page_path}:${id}` }
          );
        }
      },
      { threshold: 0.35 }
    );

    observerRef.current = observer;

    const observeAvailable = () => {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    };

    observeAvailable();
    // Sections may mount after first paint
    const delayed = window.setTimeout(observeAvailable, 800);

    return () => {
      window.clearTimeout(delayed);
      observer.disconnect();
    };
  }, [pathname, funnel, sectionIds]);

  // All relevant interactive clicks (CTAs, links, menu, WhatsApp, form buttons)
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!isInteractiveTarget(target)) return;

      const meta = resolveClickMeta(target as HTMLElement);
      if (!meta) return;

      const ctx = getMetaPageContext();
      trackMetaCustom("CTA_Click", {
        funnel,
        ...meta,
        ...ctx,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [funnel]);

  return null;
}
