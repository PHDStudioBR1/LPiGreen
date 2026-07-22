"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import {
  SEGUROS_META_PIXEL_ID,
  trackSegurosMetaPageView,
  trackSegurosMetaScroll,
} from "@/lib/analytics/meta-pixel";

/**
 * Meta Pixel da LP `/seguros`: snippet base + PageView + Scroll_50 / Scroll_90.
 */
export function MetaPixel() {
  const scriptReadyRef = useRef(false);
  const pageViewFiredRef = useRef(false);

  const markReadyAndTrack = () => {
    scriptReadyRef.current = true;
    if (pageViewFiredRef.current) return;
    pageViewFiredRef.current = true;
    trackSegurosMetaPageView();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      scriptReadyRef.current = true;
      if (!pageViewFiredRef.current) {
        pageViewFiredRef.current = true;
        trackSegurosMetaPageView();
      }
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!scriptReadyRef.current) return;
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const percent = Math.min(100, Math.round((window.scrollY / scrollHeight) * 100));
      if (percent >= 50) trackSegurosMetaScroll(50);
      if (percent >= 90) trackSegurosMetaScroll(90);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Script id={`meta-pixel-${SEGUROS_META_PIXEL_ID}`} strategy="afterInteractive" onReady={markReadyAndTrack}>
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          if (window.__igreenSegurosMetaPixelInit !== '${SEGUROS_META_PIXEL_ID}') {
            window.__igreenSegurosMetaPixelInit = '${SEGUROS_META_PIXEL_ID}';
            fbq('init', '${SEGUROS_META_PIXEL_ID}');
          }
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${SEGUROS_META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
