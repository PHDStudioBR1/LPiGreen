"use client";

import type { ReactNode } from "react";
import { Building2, Handshake, TrendingUp, Zap } from "lucide-react";
import {
  LivreCounter,
  LivreSection,
  LivreSectionHeader,
  LivreTimeline,
  MotionItem,
  MotionStagger,
  type LivreTimelineStep,
} from "@/components/livre/ui";
import { AutoridadeLogos } from "./autoridade-logos";

const CONTENT = {
  alianca:
    "A iGreen atua em aliança estratégica com a Comerc Energia.",
  plataforma:
    "A Comerc faz parte da maior plataforma multienergia do Brasil juntamente com a Vibra.",
  experiencia: "Mais de 20 anos de experiência.",
  gestao:
    "Gestão de aproximadamente 5% de toda energia consumida no Brasil.",
} as const;

const TIMELINE_STEPS: LivreTimelineStep[] = [
  { id: "alianca", title: CONTENT.alianca, icon: Handshake },
  { id: "plataforma", title: CONTENT.plataforma, icon: Building2 },
  { id: "experiencia", title: CONTENT.experiencia, icon: TrendingUp },
  { id: "gestao", title: CONTENT.gestao, icon: Zap },
];

export function AutoridadeSection() {
  return (
    <LivreSection
      id="autoridade"
      aria-labelledby="autoridade-heading"
      animate={false}
      className="relative overflow-hidden bg-livre-bg-elevated"
    >
      <div
        className="pointer-events-none absolute inset-0 livre-hero-mesh opacity-35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 livre-hero-grid opacity-60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-accent/30 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-livre-primary/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 top-1/3 size-[28rem] rounded-full bg-livre-primary/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-1/4 size-80 rounded-full bg-livre-accent/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <LivreSectionHeader
          id="autoridade-heading"
          eyebrow="Autoridade"
          title={CONTENT.alianca}
        />

        <MotionItem className="mb-14">
          <AutoridadeLogos />
        </MotionItem>

        <MotionStagger className="mb-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
          <MotionItem>
            <StatCard
              counter={
                <>
                  <LivreCounter
                    to={20}
                    className="font-lv-headline text-5xl font-extrabold tracking-tight text-livre-primary sm:text-6xl lg:text-7xl"
                  />
                  <span className="font-lv-headline text-4xl font-extrabold text-livre-primary sm:text-5xl lg:text-6xl">
                    +
                  </span>
                </>
              }
              label={CONTENT.experiencia}
            />
          </MotionItem>

          <MotionItem>
            <StatCard
              counter={
                <>
                  <LivreCounter
                    to={5}
                    className="font-lv-headline text-5xl font-extrabold tracking-tight text-livre-accent sm:text-6xl lg:text-7xl"
                  />
                  <span className="font-lv-headline text-4xl font-extrabold text-livre-accent sm:text-5xl lg:text-6xl">
                    %
                  </span>
                </>
              }
              label={CONTENT.gestao}
            />
          </MotionItem>
        </MotionStagger>

        <MotionItem className="mb-16">
          <div
            className="relative overflow-hidden rounded-lv-2xl border border-livre-petrol-500/50 bg-gradient-to-br from-livre-bg-surface/80 via-livre-bg-elevated/90 to-livre-bg-default/80 p-8 shadow-lv-lg backdrop-blur-sm sm:p-10 lg:p-12"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
              aria-hidden
            />
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-base leading-relaxed text-livre-muted sm:text-lg text-pretty">
                {CONTENT.plataforma}
              </p>
            </div>
          </div>
        </MotionItem>

        <MotionItem>
          <LivreTimeline steps={TIMELINE_STEPS} columns={4} />
        </MotionItem>
      </div>
    </LivreSection>
  );
}

function StatCard({
  counter,
  label,
}: {
  counter: ReactNode;
  label: string;
}) {
  return (
    <article
      className="group relative overflow-hidden rounded-lv-xl border border-livre-petrol-500/60 bg-livre-bg-surface/50 p-8 text-center shadow-lv-md backdrop-blur-sm transition-all duration-500 hover:border-livre-primary/35 hover:shadow-lv-glow sm:p-10"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-livre-primary/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative">
        <div className="mb-4 flex items-baseline justify-center gap-0.5">
          {counter}
        </div>
        <p className="text-sm leading-relaxed text-livre-muted sm:text-base text-pretty">
          {label}
        </p>
      </div>
    </article>
  );
}
