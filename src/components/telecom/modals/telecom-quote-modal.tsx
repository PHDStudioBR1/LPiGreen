"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { maskCep, maskCpfCnpj, maskPhone } from "@/lib/masks";
import {
  buildTelecomWhatsAppUrl,
  loadTelecomQuoteSessionFields,
  persistTelecomQuoteSessionFields,
  TELECOM_DATA_OPTIONS,
  TELECOM_PLAN_TYPES,
  TELECOM_PORTABILITY_OPTIONS,
  TELECOM_QUOTE_FORM_DEFAULTS,
  validateTelecomQuoteStep,
  type TelecomQuoteFieldErrors,
  type TelecomQuoteFormValues,
} from "@/lib/telecom/quote-form";
import {
  trackTelecomFormStep,
  trackTelecomFormSubmit,
  trackTelecomModalClose,
  trackTelecomModalOpen,
} from "@/lib/telecom/analytics";
import "@/app/telecom/telecom-quote-modal.css";

export type TelecomQuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const STEPS = [
  { id: 1, label: "Plano" },
  { id: 2, label: "Seus dados" },
] as const;

const TELECOM_CRM_SESSION_STORAGE_KEY = "telecom-crm-lead-session";

function createCrmSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `telecom-${Date.now()}`;
}

function getOrCreateCrmSessionId(): string {
  if (typeof window === "undefined") return createCrmSessionId();
  const stored = sessionStorage.getItem(TELECOM_CRM_SESSION_STORAGE_KEY);
  if (stored) return stored;
  const next = createCrmSessionId();
  sessionStorage.setItem(TELECOM_CRM_SESSION_STORAGE_KEY, next);
  return next;
}

function FormGroup({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={`tqf-group${error ? " has-error" : ""}`} id={id}>
      <label htmlFor={`${id}-field`}>
        {label} <span className="req">*</span>
      </label>
      {children}
      {error && <div className="tqf-error">{error}</div>}
    </div>
  );
}

export function TelecomQuoteModal({ isOpen, onClose }: TelecomQuoteModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<TelecomQuoteFormValues>(TELECOM_QUOTE_FORM_DEFAULTS);
  const [errors, setErrors] = useState<TelecomQuoteFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crmError, setCrmError] = useState<string | null>(null);
  const [crmSessionId, setCrmSessionId] = useState("");

  const resetForm = useCallback(() => {
    setStep(1);
    setValues(TELECOM_QUOTE_FORM_DEFAULTS);
    setErrors({});
    setIsSubmitting(false);
    setCrmError(null);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      trackTelecomModalOpen();
      setCrmSessionId(getOrCreateCrmSessionId());
      const saved = loadTelecomQuoteSessionFields();
      if (saved.name || saved.phone) {
        setValues((prev) => ({ ...prev, ...saved }));
      }
    } else {
      resetForm();
    }
  }, [isOpen, resetForm]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  });

  const handleClose = () => {
    trackTelecomModalClose();
    onClose();
  };

  const syncCrm = async (crmStep: "plan" | "contact") => {
    try {
      const res = await fetch("/api/telecom/crm-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: crmStep,
          session_id: crmSessionId,
          values: {
            planType: values.planType,
            dataGb: values.dataGb,
            portability: values.portability,
            name: values.name,
            cpfCnpj: values.cpfCnpj,
            email: values.email,
            phone: values.phone,
            cep: values.cep,
          },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Erro ao sincronizar lead");
      }
      setCrmError(null);
    } catch (err) {
      setCrmError(err instanceof Error ? err.message : "Erro ao sincronizar lead");
    }
  };

  const handleNext = async () => {
    const stepErrors = validateTelecomQuoteStep(1, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    trackTelecomFormStep(1);
    await syncCrm("plan");
    setStep(2);
  };

  const handleSubmit = async () => {
    const stepErrors = validateTelecomQuoteStep(2, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    trackTelecomFormStep(2);
    trackTelecomFormSubmit({
      plan_type: values.planType,
      portability: values.portability,
    });
    persistTelecomQuoteSessionFields({ name: values.name, phone: values.phone });
    await syncCrm("contact");
    const whatsappUrl = buildTelecomWhatsAppUrl(values);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    sessionStorage.removeItem(TELECOM_CRM_SESSION_STORAGE_KEY);
    setIsSubmitting(false);
    handleClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="telecom-quote-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            className="telecom-quote-modal-shell"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="telecom-quote-modal-close"
              onClick={handleClose}
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="telecom-quote-modal-card">
              <h2>Contratar Telecom iGreen</h2>
              <p className="subtitle">
                {step === 1
                  ? "Escolha o plano ideal para você"
                  : "Informe seus dados para finalizar"}
              </p>

              <div className="tqf-steps">
                {STEPS.map((s) => (
                  <div key={s.id} className={`tqf-step${step >= s.id ? " active" : ""}`} />
                ))}
              </div>

              {step === 1 ? (
                <>
                  <FormGroup id="planType" label="Tipo de plano" error={errors.planType}>
                    <select
                      id="planType-field"
                      value={values.planType}
                      onChange={(e) => setValues((v) => ({ ...v, planType: e.target.value }))}
                    >
                      <option value="">Selecione</option>
                      {TELECOM_PLAN_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  <FormGroup id="dataGb" label="Quantidade de dados" error={errors.dataGb}>
                    <select
                      id="dataGb-field"
                      value={values.dataGb}
                      onChange={(e) => setValues((v) => ({ ...v, dataGb: e.target.value }))}
                    >
                      <option value="">Selecione</option>
                      {TELECOM_DATA_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  <FormGroup id="portability" label="Portabilidade" error={errors.portability}>
                    <select
                      id="portability-field"
                      value={values.portability}
                      onChange={(e) => setValues((v) => ({ ...v, portability: e.target.value }))}
                    >
                      <option value="">Selecione</option>
                      {TELECOM_PORTABILITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  <div className="tqf-actions">
                    <button type="button" className="tqf-btn-primary" onClick={handleNext}>
                      Continuar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <FormGroup id="name" label="Nome completo" error={errors.name}>
                    <input
                      id="name-field"
                      type="text"
                      value={values.name}
                      onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                      placeholder="Seu nome"
                    />
                  </FormGroup>

                  <FormGroup id="phone" label="WhatsApp" error={errors.phone}>
                    <input
                      id="phone-field"
                      type="tel"
                      value={values.phone}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, phone: maskPhone(e.target.value) }))
                      }
                      placeholder="(00) 00000-0000"
                    />
                  </FormGroup>

                  <FormGroup id="cpfCnpj" label="CPF/CNPJ" error={errors.cpfCnpj}>
                    <input
                      id="cpfCnpj-field"
                      type="text"
                      value={values.cpfCnpj}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, cpfCnpj: maskCpfCnpj(e.target.value) }))
                      }
                      placeholder="000.000.000-00"
                    />
                  </FormGroup>

                  <FormGroup id="cep" label="CEP" error={errors.cep}>
                    <input
                      id="cep-field"
                      type="text"
                      value={values.cep}
                      onChange={(e) => setValues((v) => ({ ...v, cep: maskCep(e.target.value) }))}
                      placeholder="00000-000"
                    />
                  </FormGroup>

                  <FormGroup id="email" label="E-mail (opcional)" error={errors.email}>
                    <input
                      id="email-field"
                      type="email"
                      value={values.email}
                      onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </FormGroup>

                  <div className="tqf-actions">
                    <button
                      type="button"
                      className="tqf-btn-secondary"
                      onClick={() => setStep(1)}
                      disabled={isSubmitting}
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      className="tqf-btn-primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Finalizar no WhatsApp"}
                    </button>
                  </div>
                </>
              )}

              {crmError && <div className="tqf-crm-error">{crmError}</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
