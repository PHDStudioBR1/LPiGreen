"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LeadFormModal } from "@/components/modals/lead-form-modal";

export default function FormularioPage() {
  const router = useRouter();
  return (
    <LeadFormModal
      isOpen={true}
      onClose={() => router.push("/")}
    />
  );
}
