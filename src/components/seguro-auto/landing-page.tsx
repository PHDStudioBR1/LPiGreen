"use client";

import { useEffect, useState } from "react";
import { trackSegurosPageView } from "@/lib/seguros/analytics";
import { SeguroAutoHeader } from "@/components/seguro-auto/header/seguro-auto-header";
import { HeroCarouselSection } from "@/components/seguro-auto/hero/hero-carousel-section";
import { TrustBar } from "@/components/seguros/trust-bar/trust-bar";
import { BenefitsSection } from "@/components/seguros/benefits/benefits-section";
import { WhyChooseSection } from "@/components/seguros/why-choose/why-choose-section";
import { HowItWorksSection } from "@/components/seguros/how-it-works/how-it-works-section";
import { PlansSection } from "@/components/seguros/plans/plans-section";
import { TestimonialsSection } from "@/components/seguros/testimonials/testimonials-section";
import { IgreenClubSection } from "@/components/seguros/igreen-club/igreen-club-section";
import { AppDriverSection } from "@/components/seguros/app-driver/app-driver-section";
import { FaqSection } from "@/components/seguros/faq/faq-section";
import { StickyMobileBar } from "@/components/seguros/floating/sticky-mobile-bar";
import { ScrollCta } from "@/components/seguros/floating/scroll-cta";
import { ExitIntentPopup } from "@/components/seguros/floating/exit-intent-popup";
import { SegurosFooter } from "@/components/seguros/footer/seguros-footer";
import { SegurosQuoteModal } from "@/components/seguros/modals/seguros-quote-modal";

export function SeguroAutoLandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openQuote = () => setIsFormOpen(true);

  useEffect(() => {
    trackSegurosPageView();
  }, []);

  return (
    <div className="seguro-auto-page min-h-screen w-full min-w-0 overflow-x-hidden font-sa-body">
      <SeguroAutoHeader onQuoteClick={openQuote} />

      <main className="pb-20 md:pb-0">
        <HeroCarouselSection onQuoteClick={openQuote} />

        <div className="seguros-page min-w-0 font-body">
          <TrustBar />
          <BenefitsSection />
          <WhyChooseSection onQuoteClick={openQuote} />
          <HowItWorksSection onQuoteClick={openQuote} />
          <PlansSection onQuoteClick={openQuote} />
          <TestimonialsSection />
          <IgreenClubSection onQuoteClick={openQuote} />
          <AppDriverSection onQuoteClick={openQuote} />
          <FaqSection />
        </div>
      </main>

      <div className="seguros-page font-body">
        <SegurosFooter />
      </div>

      <StickyMobileBar onQuoteClick={openQuote} />
      <ScrollCta onQuoteClick={openQuote} />
      <ExitIntentPopup onQuoteClick={openQuote} />

      <SegurosQuoteModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
