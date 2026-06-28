"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LeadFormModal } from "@/components/modals/lead-form-modal";
import {
  trackLicFormStep,
  trackLicFormSubmit,
  trackLicModalClose,
  trackLicModalOpen,
  trackLicPageView,
} from "@/lib/lic/analytics";

export default function FormularioPage() {
  const router = useRouter();

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

  return (
    <LeadFormModal
      isOpen={true}
      onClose={() => router.push("/")}
      analytics={leadFormAnalytics}
    />
  );
}
