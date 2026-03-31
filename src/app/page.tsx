"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/sections/hero";
import { AuthoritySection } from "@/components/sections/authority";
import { LegalSection } from "@/components/sections/legal";
import { IncomeSourcesSection } from "@/components/sections/income-sources";
import { LicenciadoProSection } from "@/components/sections/licenciado-pro-section";
import { CareerPlanSection } from "@/components/sections/career-plan-section";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { EligibilitySection } from "@/components/sections/eligibility-section";
import { FAQSection } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { StickyHeader } from "@/components/ui/sticky-header";
import { LeadFormModal } from "@/components/modals/lead-form-modal";

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const handleCTAClick = () => setIsFormModalOpen(true);

  return (
    <div className="min-h-screen w-full min-w-0 font-body flex flex-col overflow-x-hidden bg-background">
      <StickyHeader onCTAClick={handleCTAClick} />

      <main className="flex-grow w-full min-w-0 pt-20">
        <HeroSection onCTAClick={handleCTAClick} />
        <AuthoritySection onCTAClick={handleCTAClick} />
        <LegalSection />
        <IncomeSourcesSection />
        <LicenciadoProSection />
        <CareerPlanSection />
        <HowItWorksSection />
        <EligibilitySection onCTAClick={handleCTAClick} />
        <FAQSection />
      </main>

      <Footer onCTAClick={handleCTAClick} />

      <LeadFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} />

      <WhatsAppButton />
    </div>
  );
}
