"use client"

import React, { useState } from 'react';
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
import { MediaSection } from '@/components/sections/media';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { StickyHeader } from '@/components/ui/sticky-header';
import { LeadFormModal } from '@/components/modals/lead-form-modal';

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const handleCTAClick = () => setIsFormModalOpen(true);

  return (
    <div className="min-h-screen font-body flex flex-col">
      <StickyHeader onCTAClick={handleCTAClick} />
      
      <main className="flex-grow">
        <HeroSection onCTAClick={handleCTAClick} />
        <AuthoritySection onCTAClick={handleCTAClick} />
        <LegalSection />
        <GlobalTrendSection />
        <PressProofSection />
        <HowItWorksSection />
        <EligibilitySection onCTAClick={handleCTAClick} />
        <SimulatorSection onCTAClick={handleCTAClick} />
        <ScarcitySection />
        <StepsSection />
        <SocialProofSection />
        <BenefitsSection />
        <MediaSection />
        <FAQSection />
      </main>

      <Footer onCTAClick={handleCTAClick} />

      <LeadFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} />
      
      <WhatsAppButton />
    </div>
  );
}
