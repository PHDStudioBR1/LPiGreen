"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  META_PIXEL_IDS,
  type MetaPixelFunnel,
  resetMetaPixelOnceKeys,
  trackMetaPageView,
} from "@/lib/analytics/meta-pixel";
import { MetaJourneyTracker } from "@/components/analytics/meta-journey-tracker";

type MetaPixelProps = {
  funnel: MetaPixelFunnel;
  sectionIds?: string[];
};

const DEFAULT_SECTIONS: Record<MetaPixelProps["funnel"], string[]> = {
  seguros: [
    "inicio",
    "beneficios",
    "comparacao",
    "como-funciona",
    "planos",
    "igreen-club",
    "depoimentos",
    "motorista-app",
    "faq",
  ],
  "seguro-auto": [
    "inicio",
    "vantagens",
    "planos",
    "comparacao",
    "igreen-club",
    "depoimentos",
    "motorista-app",
    "faq",
  ],
};

/**
 * Single Meta Pixel instance for /seguros and /seguro-auto layouts.
 * PageView is driven by SPA pathname changes (not by the base snippet) to avoid duplicates.
 */
export function MetaPixel({ funnel, sectionIds }: MetaPixelProps) {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);
  const scriptReadyRef = useRef(false);

  const firePageView = (path: string) => {
    if (!scriptReadyRef.current) return;
    if (lastPathRef.current === path) return;

    resetMetaPixelOnceKeys(`ScrollDepth:${path}`);
    resetMetaPixelOnceKeys(`TimeOnPage:${path}`);
    resetMetaPixelOnceKeys(`SectionViewed:${path}`);
    resetMetaPixelOnceKeys(`LandingVisited:${path}`);

    lastPathRef.current = path;
    trackMetaPageView({ funnel, page_path: path });
  };

  const markReadyAndTrack = () => {
    scriptReadyRef.current = true;
    if (pathname) firePageView(pathname);
  };

  useEffect(() => {
    if (!pathname) return;
    // If script already loaded (client navigation within segment), track immediately
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      scriptReadyRef.current = true;
    }
    firePageView(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, funnel]);

  const sections = sectionIds ?? DEFAULT_SECTIONS[funnel];
  const pixelId = META_PIXEL_IDS[funnel];

  return (
    <>
      <Script
        id={`meta-pixel-${pixelId}`}
        strategy="afterInteractive"
        onReady={markReadyAndTrack}
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          if (window.__igreenMetaPixelInit !== '${pixelId}') {
            window.__igreenMetaPixelInit = '${pixelId}';
            fbq('init', '${pixelId}');
          }
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <MetaJourneyTracker funnel={funnel} sectionIds={sections} />
    </>
  );
}
