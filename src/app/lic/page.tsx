"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/lic/hero";
import { AuthoritySection } from "@/components/lic/authority";
import { IncomeSourcesSection } from "@/components/lic/income-sources";
import { HowItWorksSection } from "@/components/lic/how-it-works";
import { EligibilitySection } from "@/components/lic/eligibility-section";
import { FAQSection } from "@/components/lic/faq";
import { Footer } from "@/components/lic/footer";
import { StickyHeader } from "@/components/lic/sticky-header";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { LeadFormModal } from "@/components/modals/lead-form-modal";

export default function LicPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const handleCTAClick = () => setIsFormModalOpen(true);

  return (
    <div className="min-h-screen w-full min-w-0 font-body flex flex-col overflow-x-hidden bg-background">
      <StickyHeader onCTAClick={handleCTAClick} />

      <main className="flex-grow w-full min-w-0 pt-20">
        <HeroSection onCTAClick={handleCTAClick} />
        <AuthoritySection onCTAClick={handleCTAClick} />
        <HowItWorksSection />
        <IncomeSourcesSection />
        <FAQSection />
        <EligibilitySection onCTAClick={handleCTAClick} />
      </main>

      <Footer onCTAClick={handleCTAClick} />

      <LeadFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} />

      <WhatsAppButton />
    </div>
  );
}
