"use client";

import type { ReactNode } from "react";
import { MotionItem, MotionStagger, scaleIn } from "@/components/livre/ui";
import { cn } from "@/lib/utils";
import {
  AmbevLogo,
  BrfLogo,
  CacauShowLogo,
  GrupoMateusLogo,
  HondaLogo,
  MarinhaLogo,
  RenaultLogo,
} from "./brand-logos";

type Brand = {
  id: string;
  label: string;
  logo: ReactNode;
};

const BRANDS: Brand[] = [
  { id: "honda", label: "Honda", logo: <HondaLogo /> },
  { id: "renault", label: "Renault", logo: <RenaultLogo /> },
  { id: "marinha", label: "Marinha do Brasil", logo: <MarinhaLogo /> },
  { id: "ambev", label: "Ambev", logo: <AmbevLogo /> },
  { id: "cacau-show", label: "Cacau Show", logo: <CacauShowLogo /> },
  { id: "brf", label: "BRF", logo: <BrfLogo /> },
  { id: "grupo-mateus", label: "Grupo Mateus", logo: <GrupoMateusLogo /> },
];

export function ProvaSocialLogos() {
  return (
    <MotionStagger className="flex flex-wrap items-stretch justify-center gap-4 sm:gap-5 lg:gap-6">
      {BRANDS.map((brand) => (
        <MotionItem
          key={brand.id}
          variants={scaleIn}
          className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.84rem)] lg:w-[calc(25%-1.125rem)] max-w-[16rem]"
        >
          <BrandCard label={brand.label}>{brand.logo}</BrandCard>
        </MotionItem>
      ))}
    </MotionStagger>
  );
}

function BrandCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <article
      aria-label={label}
      className={cn(
        "group relative flex h-full min-h-[7rem] items-center justify-center overflow-hidden",
        "rounded-lv-xl border border-livre-petrol-500/50 bg-livre-bg-surface/25 p-6 sm:min-h-[7.5rem] sm:p-8",
        "shadow-lv-sm backdrop-blur-sm",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1.5 hover:border-livre-primary/45 hover:bg-livre-bg-surface/55 hover:shadow-lv-glow"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-livre-primary/[0.08] via-transparent to-livre-accent/[0.06] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div
        className={cn(
          "relative text-livre-text/65 transition-all duration-500",
          "group-hover:scale-[1.06] group-hover:text-livre-text"
        )}
      >
        {children}
      </div>
    </article>
  );
}
