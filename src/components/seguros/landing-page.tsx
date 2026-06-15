"use client";

import { useState } from "react";
import { HeroSection } from "@/components/seguros/hero/hero-section";
import { TrustBar } from "@/components/seguros/trust-bar/trust-bar";
import { BenefitsSection } from "@/components/seguros/benefits/benefits-section";
import { WhyChooseSection } from "@/components/seguros/why-choose/why-choose-section";
import { HowItWorksSection } from "@/components/seguros/how-it-works/how-it-works-section";
import { PlansSection } from "@/components/seguros/plans/plans-section";
import { TestimonialsSection } from "@/components/seguros/testimonials/testimonials-section";
import { AppDriverSection } from "@/components/seguros/app-driver/app-driver-section";
import { AssistanceSection } from "@/components/seguros/assistance/assistance-section";
import { FaqSection } from "@/components/seguros/faq/faq-section";
import { FinalCtaSection } from "@/components/seguros/cta/final-cta-section";
import { WhatsAppFloat } from "@/components/seguros/floating/whatsapp-float";
import { StickyMobileBar } from "@/components/seguros/floating/sticky-mobile-bar";
import { ScrollCta } from "@/components/seguros/floating/scroll-cta";
import { ExitIntentPopup } from "@/components/seguros/floating/exit-intent-popup";
import { SegurosFooter } from "@/components/seguros/footer/seguros-footer";
import { LeadFormModal } from "@/components/modals/lead-form-modal";
import { SegurosHeader } from "@/components/seguros/header/seguros-header";

export function SegurosLandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openQuote = () => setIsFormOpen(true);

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
        <AppDriverSection onQuoteClick={openQuote} />
        <AssistanceSection />
        <FaqSection />
        <FinalCtaSection onQuoteClick={openQuote} />
      </main>

      <SegurosFooter />

      <WhatsAppFloat />
      <StickyMobileBar onQuoteClick={openQuote} />
      <ScrollCta onQuoteClick={openQuote} />
      <ExitIntentPopup onQuoteClick={openQuote} />

      <LeadFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
