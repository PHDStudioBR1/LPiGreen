"use client";

import { useEffect, useState } from "react";
import { trackTelecomPageView } from "@/lib/telecom/analytics";
import { Header } from "@/components/telecom/header/header";
import { HeroSection } from "@/components/telecom/hero/hero-section";
import { BenefitsSection } from "@/components/telecom/sections/benefits-section";
import { PlansSection } from "@/components/telecom/sections/plans-section";
import { ComparisonSection } from "@/components/telecom/sections/comparison-section";
import { HowItWorksSection } from "@/components/telecom/sections/how-it-works-section";
import { ClubSection } from "@/components/telecom/sections/club-section";
import { TestimonialsSection } from "@/components/telecom/sections/testimonials-section";
import { FaqSection } from "@/components/telecom/sections/faq-section";
import { CtaBanner } from "@/components/telecom/sections/cta-banner";
import { Footer } from "@/components/telecom/footer/footer";
import { StickyMobileBar } from "@/components/telecom/floating/sticky-mobile-bar";
import { ScrollCta } from "@/components/telecom/floating/scroll-cta";
import { ExitIntentPopup } from "@/components/telecom/floating/exit-intent-popup";
import { WhatsAppFloat } from "@/components/telecom/floating/whatsapp-float";
import { TelecomQuoteModal } from "@/components/telecom/modals/telecom-quote-modal";
import { TelecomPageBackground } from "@/components/telecom/ui/telecom-page-background";

export function TelecomLandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openQuote = () => setIsFormOpen(true);

  useEffect(() => {
    trackTelecomPageView();
  }, []);

  return (
    <div className="telecom-page relative min-h-screen w-full min-w-0 overflow-x-hidden bg-[#060806] font-tc-body text-white antialiased">
      <TelecomPageBackground />

      <div className="relative z-10">
        <Header onQuoteClick={openQuote} />

        <main className="pb-20 md:pb-0">
          <HeroSection onQuoteClick={openQuote} />
          <BenefitsSection />
          <PlansSection onQuoteClick={openQuote} />
          <ComparisonSection onQuoteClick={openQuote} />
          <HowItWorksSection />
          <ClubSection onQuoteClick={openQuote} />
          <TestimonialsSection />
          <FaqSection />
          <CtaBanner onQuoteClick={openQuote} />
        </main>

        <Footer />
      </div>

      <StickyMobileBar onQuoteClick={openQuote} />
      <ScrollCta onQuoteClick={openQuote} />
      <ExitIntentPopup onQuoteClick={openQuote} />
      <WhatsAppFloat />

      <TelecomQuoteModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
