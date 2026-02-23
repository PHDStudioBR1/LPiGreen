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
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { StickyHeader } from '@/components/ui/sticky-header';
import { EligibilityModal } from '@/components/modals/eligibility-modal';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCTAClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen font-body flex flex-col">
      <StickyHeader onCTAClick={handleCTAClick} />
      
      <main className="flex-grow">
        <HeroSection onCTAClick={handleCTAClick} />
        <AuthoritySection />
        <HowItWorksSection />
        <SimulatorSection onCTAClick={handleCTAClick} />
        <ScarcitySection />
        <SocialProofSection />
        <FAQSection />
      </main>

      <Footer />
      
      <WhatsAppButton />
      
      <EligibilityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <Toaster />
    </div>
  );
}
