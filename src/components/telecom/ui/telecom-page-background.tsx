"use client";

import { HeroParticles } from "@/components/telecom/hero/hero-particles";

export function TelecomPageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#060806]" aria-hidden>
      <HeroParticles />
    </div>
  );
}
