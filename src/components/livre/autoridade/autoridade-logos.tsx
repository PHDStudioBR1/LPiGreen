"use client";

import Image from "next/image";
import { MotionItem, MotionStagger } from "@/components/livre/ui";
import { cn } from "@/lib/utils";

function ComercLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto sm:h-9", className)}
      aria-label="Comerc Energia"
      role="img"
    >
      <text
        x="0"
        y="30"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="26"
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        comerc
      </text>
      <text
        x="108"
        y="30"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="14"
        fontWeight="500"
        opacity="0.75"
      >
        energia
      </text>
    </svg>
  );
}

function VibraLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto sm:h-9", className)}
      aria-label="Vibra"
      role="img"
    >
      <text
        x="0"
        y="32"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="0.04em"
      >
        VIBRA
      </text>
    </svg>
  );
}

const LOGOS = [
  {
    id: "igreen",
    label: "iGreen",
    content: (
      <Image
        src="/images/logo_igreen_verde.png"
        alt="iGreen"
        width={120}
        height={40}
        className="h-8 w-auto object-contain sm:h-9"
      />
    ),
  },
  {
    id: "comerc",
    label: "Comerc Energia",
    content: <ComercLogo className="text-livre-text" />,
  },
  {
    id: "vibra",
    label: "Vibra",
    content: <VibraLogo className="text-livre-text" />,
  },
] as const;

export function AutoridadeLogos() {
  return (
    <MotionStagger className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {LOGOS.map((logo, index) => (
        <MotionItem key={logo.id} className="flex items-center gap-4 sm:gap-6">
          <div
            className={cn(
              "flex h-16 min-w-[9rem] items-center justify-center rounded-lv-lg px-6",
              "border border-livre-petrol-500/60 bg-livre-bg-surface/40",
              "shadow-lv-sm backdrop-blur-sm",
              "transition-colors duration-300 hover:border-livre-primary/30 hover:bg-livre-bg-surface/60"
            )}
          >
            {logo.content}
          </div>

          {index < LOGOS.length - 1 && (
            <span
              className="hidden text-lg font-light text-livre-muted/50 sm:inline"
              aria-hidden
            >
              ×
            </span>
          )}
        </MotionItem>
      ))}
    </MotionStagger>
  );
}
