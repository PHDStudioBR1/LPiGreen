"use client";

import { useEffect, useState } from "react";
import { trackSeguroAutoPageView } from "@/lib/seguro-auto/analytics";
import { Header } from "@/components/seguro-auto/header/header";
import { HeroSection } from "@/components/seguro-auto/hero/hero-section";
import { HighlightsMarquee } from "@/components/seguros/highlights-marquee/highlights-marquee";
import { PlansShowcase } from "@/components/seguro-auto/sections/plans-showcase";
import { BenefitsSection } from "@/components/seguro-auto/sections/benefits-section";
import { ComparisonSection } from "@/components/seguro-auto/sections/comparison-section";
import { ClubSection } from "@/components/seguro-auto/sections/club-section";
import { TestimonialsSection } from "@/components/seguro-auto/sections/testimonials-section";
import { AppSection } from "@/components/seguro-auto/sections/app-section";
import { FaqSection } from "@/components/seguro-auto/sections/faq-section";
import { CtaBanner } from "@/components/seguro-auto/sections/cta-banner";
import { Footer } from "@/components/seguro-auto/footer/footer";
import { StickyMobileBar } from "@/components/seguro-auto/floating/sticky-mobile-bar";
import { ScrollCta } from "@/components/seguro-auto/floating/scroll-cta";
import { ExitIntentPopup } from "@/components/seguro-auto/floating/exit-intent-popup";
import { WhatsAppFloat } from "@/components/seguro-auto/floating/whatsapp-float";
import { SegurosQuoteModal } from "@/components/seguros/modals/seguros-quote-modal";

export function SeguroAutoLandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openQuote = () => setIsFormOpen(true);

  useEffect(() => {
    trackSeguroAutoPageView();
  }, []);

  return (
    <div className="seguro-auto-page min-h-screen w-full min-w-0 overflow-x-hidden bg-white font-sa-body text-sa-text antialiased">
      <Header onQuoteClick={openQuote} />

      <main className="pb-20 md:pb-0">
        <HeroSection onQuoteClick={openQuote} />
        <HighlightsMarquee variant="seguro-auto" />
        <BenefitsSection />
        <PlansShowcase />
        <ComparisonSection onQuoteClick={openQuote} />
        <ClubSection onQuoteClick={openQuote} />
        <TestimonialsSection />
        <AppSection onQuoteClick={openQuote} />
        <FaqSection />
        <CtaBanner onQuoteClick={openQuote} />
      </main>

      <Footer />

      <StickyMobileBar onQuoteClick={openQuote} />
      <ScrollCta onQuoteClick={openQuote} />
      <ExitIntentPopup onQuoteClick={openQuote} />
      <WhatsAppFloat onQuoteClick={openQuote} />

      <SegurosQuoteModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        variant="seguro-auto"
      />
    </div>
  );
}
