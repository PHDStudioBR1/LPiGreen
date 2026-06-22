"use client";

import { useEffect, useState } from "react";
import { trackSegurosPageView } from "@/lib/seguros/analytics";
import { HeroSection } from "@/components/seguros/hero/hero-section";
import { TrustBar } from "@/components/seguros/trust-bar/trust-bar";
import { BenefitsSection } from "@/components/seguros/benefits/benefits-section";
import { WhyChooseSection } from "@/components/seguros/why-choose/why-choose-section";
import { HowItWorksSection } from "@/components/seguros/how-it-works/how-it-works-section";
import { PlansSection } from "@/components/seguros/plans/plans-section";
import { TestimonialsSection } from "@/components/seguros/testimonials/testimonials-section";
import { AppDriverSection } from "@/components/seguros/app-driver/app-driver-section";
import { IgreenClubSection } from "@/components/seguros/igreen-club/igreen-club-section";
import { FaqSection } from "@/components/seguros/faq/faq-section";
import { StickyMobileBar } from "@/components/seguros/floating/sticky-mobile-bar";
import { ScrollCta } from "@/components/seguros/floating/scroll-cta";
import { ExitIntentPopup } from "@/components/seguros/floating/exit-intent-popup";
import { SegurosFooter } from "@/components/seguros/footer/seguros-footer";
import { SegurosQuoteModal } from "@/components/seguros/modals/seguros-quote-modal";
import { SegurosHeader } from "@/components/seguros/header/seguros-header";

export function SegurosLandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openQuote = () => setIsFormOpen(true);

  useEffect(() => {
    trackSegurosPageView();
  }, []);

  return (
    <div className="seguros-page min-h-screen w-full min-w-0 font-body overflow-x-hidden">
      <SegurosHeader onQuoteClick={openQuote} />
      <main className="pb-20 md:pb-0">
        <HeroSection onQuoteClick={openQuote} />
        <TrustBar />
        <BenefitsSection />
        <WhyChooseSection onQuoteClick={openQuote} />
        <HowItWorksSection onQuoteClick={openQuote} />
        <PlansSection onQuoteClick={openQuote} />
        <TestimonialsSection />
        <IgreenClubSection onQuoteClick={openQuote} />
        <AppDriverSection onQuoteClick={openQuote} />
        <FaqSection />
      </main>

      <SegurosFooter />

      <StickyMobileBar onQuoteClick={openQuote} />
      <ScrollCta onQuoteClick={openQuote} />
      <ExitIntentPopup onQuoteClick={openQuote} />

      <SegurosQuoteModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
