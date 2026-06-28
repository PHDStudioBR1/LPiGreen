"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { openLicWhatsApp } from "@/lib/lic/whatsapp";
import {
  trackLicCTAClick,
  trackLicFormStep,
  trackLicFormSubmit,
  trackLicModalClose,
  trackLicModalOpen,
  trackLicPageView,
} from "@/lib/lic/analytics";

export default function LicPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const leadFormAnalytics = useMemo(
    () => ({
      onModalOpen: trackLicModalOpen,
      onModalClose: trackLicModalClose,
      onFormStep: trackLicFormStep,
      onFormSubmit: trackLicFormSubmit,
    }),
    []
  );

  useEffect(() => {
    trackLicPageView();
  }, []);

  const handleCTAClick = (location: string) => {
    trackLicCTAClick(location);
    setIsFormModalOpen(true);
  };

  const handleModalClose = () => {
    setIsFormModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full min-w-0 font-body flex flex-col overflow-x-hidden bg-background">
      <StickyHeader onCTAClick={() => handleCTAClick("sticky_header")} />

      <main className="flex-grow w-full min-w-0 pt-20">
        <HeroSection onCTAClick={() => handleCTAClick("hero")} />
        <AuthoritySection onCTAClick={() => handleCTAClick("authority")} />
        <HowItWorksSection />
        <IncomeSourcesSection />
        <FAQSection />
        <EligibilitySection onCTAClick={() => handleCTAClick("eligibility")} />
      </main>

      <Footer onCTAClick={() => handleCTAClick("footer")} />

      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={handleModalClose}
        analytics={leadFormAnalytics}
      />

      <WhatsAppButton onClick={() => openLicWhatsApp("float")} />
    </div>
  );
}
