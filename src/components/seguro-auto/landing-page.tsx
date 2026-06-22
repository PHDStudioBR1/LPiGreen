"use client";

import { useEffect, useState } from "react";
import { trackSegurosPageView } from "@/lib/seguros/analytics";
import { Header } from "@/components/seguro-auto/header/header";
import { HeroSection } from "@/components/seguro-auto/hero/hero-section";
import { TrustBar } from "@/components/seguro-auto/sections/trust-bar";
import { PlansShowcase } from "@/components/seguro-auto/sections/plans-showcase";
import { ProductsGrid } from "@/components/seguro-auto/sections/products-grid";
import { BenefitsSection } from "@/components/seguro-auto/sections/benefits-section";
import { ComparisonSection } from "@/components/seguro-auto/sections/comparison-section";
import { HowItWorksSection } from "@/components/seguro-auto/sections/how-it-works-section";
import { TestimonialsSection } from "@/components/seguro-auto/sections/testimonials-section";
import { ClubSection } from "@/components/seguro-auto/sections/club-section";
import { AppSection } from "@/components/seguro-auto/sections/app-section";
import { FaqSection } from "@/components/seguro-auto/sections/faq-section";
import { CtaBanner } from "@/components/seguro-auto/sections/cta-banner";
import { Footer } from "@/components/seguro-auto/footer/footer";
import { StickyMobileBar } from "@/components/seguro-auto/floating/sticky-mobile-bar";
import { ScrollCta } from "@/components/seguro-auto/floating/scroll-cta";
import { ExitIntentPopup } from "@/components/seguro-auto/floating/exit-intent-popup";
import { SegurosQuoteModal } from "@/components/seguros/modals/seguros-quote-modal";

export function SeguroAutoLandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openQuote = () => setIsFormOpen(true);

  useEffect(() => {
    trackSegurosPageView();
  }, []);

  return (
    <div className="seguro-auto-page min-h-screen w-full min-w-0 overflow-x-hidden bg-white font-sa-body text-sa-text antialiased">
      <Header onQuoteClick={openQuote} />

      <main className="pb-20 md:pb-0">
        <HeroSection onQuoteClick={openQuote} />
        <TrustBar />
        <PlansShowcase />
        <ProductsGrid onQuoteClick={openQuote} />
        <BenefitsSection />
        <ComparisonSection onQuoteClick={openQuote} />
        <HowItWorksSection onQuoteClick={openQuote} />
        <TestimonialsSection />
        <ClubSection onQuoteClick={openQuote} />
        <AppSection onQuoteClick={openQuote} />
        <FaqSection />
        <CtaBanner onQuoteClick={openQuote} />
      </main>

      <Footer />

      <StickyMobileBar onQuoteClick={openQuote} />
      <ScrollCta onQuoteClick={openQuote} />
      <ExitIntentPopup onQuoteClick={openQuote} />

      <SegurosQuoteModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
