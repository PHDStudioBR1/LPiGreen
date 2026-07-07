"use client";

import { AutoridadeSection } from "@/components/livre/autoridade/autoridade-section";
import { CtaFinalSection } from "@/components/livre/cta-final/cta-final-section";
import { FaqSection } from "@/components/livre/faq/faq-section";
import { ProvaSocialSection } from "@/components/livre/prova-social/prova-social-section";
import { PilaresVantagemSection } from "@/components/livre/beneficios/pilares-vantagem-section";
import { ComoFuncionaSection } from "@/components/livre/como-funciona/como-funciona-section";
import { IgreenClubSection } from "@/components/livre/igreen-club/igreen-club-section";
import { HeroSection } from "@/components/livre/hero/hero-section";
import { ConexaoLivreSection } from "@/components/livre/o-que-e/conexao-livre-section";
import { QuemPodeAderirSection } from "@/components/livre/quem-pode-aderir/quem-pode-aderir-section";
import { LivreFooter } from "@/components/livre/footer/footer";
import { LivreNavbar } from "@/components/livre/navbar/navbar";
import { LivreStickyCtaBar } from "@/components/livre/ui/sticky-cta-bar";

export function LivreLandingPage() {
  return (
    <div className="livre-page min-h-screen overflow-x-hidden bg-livre-bg-base font-lv-body text-livre-text antialiased">
      <a
        href="#hero-heading"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-livre-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-livre-petrol-900"
      >
        Ir para o conteúdo principal
      </a>

      <LivreNavbar />
      <LivreStickyCtaBar />

      <main className="pb-20 lg:pb-0">
        <HeroSection />
        <ConexaoLivreSection />
        <PilaresVantagemSection />
        <IgreenClubSection />
        <QuemPodeAderirSection />
        <ComoFuncionaSection />
        <ProvaSocialSection />
        <AutoridadeSection />
        <FaqSection />
        <CtaFinalSection />
      </main>

      <LivreFooter />
    </div>
  );
}
