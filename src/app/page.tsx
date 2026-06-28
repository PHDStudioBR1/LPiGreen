"use client"

import React, { useEffect, useState } from 'react';
import { HeroSection } from '@/components/sections/hero';
import { AuthoritySection } from '@/components/sections/authority';
import { HowItWorksSection } from '@/components/sections/how-it-works';
import { SimulatorSection } from '@/components/sections/simulator';
import { ScarcitySection } from '@/components/sections/scarcity';
import { SocialProofSection } from '@/components/sections/social-proof';
import { FAQSection } from '@/components/sections/faq';
import { Footer } from '@/components/sections/footer';
import { LegalSection } from '@/components/sections/legal';
import { GlobalTrendSection } from '@/components/sections/global-trend';
import { PressProofSection } from '@/components/sections/press-proof';
import { EligibilitySection } from '@/components/sections/eligibility-section';
import { StepsSection } from '@/components/sections/steps';
import { BenefitsSection } from '@/components/sections/benefits';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { StickyHeader } from '@/components/ui/sticky-header';
import { ConexaoGreenQualificationModal } from '@/components/modals/conexao-green-qualification-modal';
import { openHomeWhatsApp } from '@/lib/home/whatsapp';
import {
  trackHomeCTAClick,
  trackHomeModalClose,
  trackHomeModalOpen,
  trackHomePageView,
} from '@/lib/home/analytics';

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [simulatedMonthlyBill, setSimulatedMonthlyBill] = useState(400);

  useEffect(() => {
    trackHomePageView();
  }, []);

  const handleCTAClick = (location: string) => {
    trackHomeCTAClick(location);
    trackHomeModalOpen();
    setIsFormModalOpen(true);
  };

  const handleModalClose = () => {
    trackHomeModalClose();
    setIsFormModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full min-w-0 font-body flex flex-col overflow-x-hidden">
      <StickyHeader onCTAClick={() => handleCTAClick("sticky_header")} />
      
      <main className="flex-grow w-full min-w-0 pt-20">
        <HeroSection onCTAClick={() => handleCTAClick("hero")} />
        <AuthoritySection onCTAClick={() => handleCTAClick("authority")} />
        <LegalSection />
        <GlobalTrendSection />
        <PressProofSection />
        <HowItWorksSection />
        <EligibilitySection onCTAClick={() => handleCTAClick("eligibility")} />
        <SimulatorSection
          onCTAClick={() => handleCTAClick("simulator")}
          billValue={simulatedMonthlyBill}
          onBillValueChange={setSimulatedMonthlyBill}
        />
        <ScarcitySection />
        <StepsSection />
        <SocialProofSection />
        <BenefitsSection />
        <FAQSection />
      </main>

      <Footer onCTAClick={() => handleCTAClick("footer")} />

      <ConexaoGreenQualificationModal
        isOpen={isFormModalOpen}
        onClose={handleModalClose}
        simulatedMonthlyBill={simulatedMonthlyBill}
      />
      
      <WhatsAppButton onClick={() => openHomeWhatsApp("float")} />
    </div>
  );
}
