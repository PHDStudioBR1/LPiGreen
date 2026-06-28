"use client"

import React, { useEffect, useState } from 'react';
import { HeroSection } from '@/components/sections/hero';
import { SimulatorSection } from '@/components/sections/simulator';
import { IgreenClubSection } from '@/components/sections/igreen-club-section';
import { VideoTestimonialsSection } from '@/components/sections/video-testimonials-section';
import { FAQSection } from '@/components/sections/faq';
import { Footer } from '@/components/sections/footer';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { StickyHeader } from '@/components/ui/sticky-header';
import { redirectHomeConversion, redirectHomeWhatsAppFloat } from '@/lib/home/whatsapp';
import { trackHomePageView } from '@/lib/home/analytics';

export default function Home() {
  const [simulatedMonthlyBill, setSimulatedMonthlyBill] = useState(400);

  useEffect(() => {
    trackHomePageView();
  }, []);

  return (
    <div className="min-h-screen w-full min-w-0 font-body flex flex-col overflow-x-hidden">
      <StickyHeader onCTAClick={() => redirectHomeConversion("sticky_header")} />

      <main className="flex-grow w-full min-w-0 pt-20">
        <HeroSection onCTAClick={() => redirectHomeConversion("hero")} />
        <SimulatorSection
          onCTAClick={() => redirectHomeConversion("simulator")}
          billValue={simulatedMonthlyBill}
          onBillValueChange={setSimulatedMonthlyBill}
        />
        <IgreenClubSection onCTAClick={() => redirectHomeConversion("igreen_club")} />
        <VideoTestimonialsSection />
        <FAQSection />
      </main>

      <Footer onCTAClick={() => redirectHomeConversion("footer")} />

      <WhatsAppButton onClick={redirectHomeWhatsAppFloat} />
    </div>
  );
}
