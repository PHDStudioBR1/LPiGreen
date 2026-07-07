"use client";

import {
  LivreSection,
  LivreSectionHeader,
  MotionItem,
} from "@/components/livre/ui";
import { ProvaSocialLogos } from "./prova-social-logos";

const CONTENT = {
  title: "Empresas de referência já confiam na energia livre",
  description:
    "Grandes marcas nacionais e internacionais escolheram soluções de energia com a iGreen e a Comerc Energia.",
} as const;

export function ProvaSocialSection() {
  return (
    <LivreSection
      id="prova-social"
      aria-labelledby="prova-social-heading"
      animate={false}
      className="relative overflow-hidden bg-livre-bg-base"
    >
      <div
        className="pointer-events-none absolute inset-0 livre-hero-mesh opacity-30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 livre-hero-grid opacity-45"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-accent/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-livre-primary/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/4 size-72 rounded-full bg-livre-primary/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/3 size-64 rounded-full bg-livre-accent/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <MotionItem>
          <LivreSectionHeader
            id="prova-social-heading"
            eyebrow="Prova Social"
            title={CONTENT.title}
            description={CONTENT.description}
          />
        </MotionItem>

        <ProvaSocialLogos />
      </div>
    </LivreSection>
  );
}
