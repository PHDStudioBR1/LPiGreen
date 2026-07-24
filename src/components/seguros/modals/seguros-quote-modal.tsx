"use client";

import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { maskBirthDate, maskCep, maskCpfCnpj, maskPhone } from "@/lib/masks";
import {
  loadQuoteSessionFields,
  maskPlate,
  persistQuoteSessionFields,
  SEGUROS_QUOTE_FORM_DEFAULTS,
  SEGUROS_VEHICLE_TYPES,
  SEGUROS_YES_NO_OPTIONS,
  validateQuoteStep,
  type SegurosQuoteFieldErrors,
  type SegurosQuoteFormValues,
} from "@/lib/seguros/quote-form";
import {
  trackSegurosFormStep,
  trackSegurosFormSubmit,
  trackSegurosModalClose,
  trackSegurosModalOpen,
} from "@/lib/seguros/analytics";
import {
  trackSeguroAutoFormStep,
  trackSeguroAutoFormSubmit,
  trackSeguroAutoModalClose,
  trackSeguroAutoModalOpen,
} from "@/lib/seguro-auto/analytics";
import {
  extractVehicleYear,
  mapUsageType,
  resetMetaPixelOnceKeys,
  trackSegurosMetaInitiateCheckout,
  trackSegurosMetaLead,
  trackSegurosMetaStep2,
  trackSegurosMetaStep3,
} from "@/lib/analytics/meta-pixel";
import { readStoredAttribution } from "@/lib/attribution/utm";
import "@/app/seguros/seguros-quote-modal.css";

export type SegurosQuoteModalVariant = "seguros" | "seguro-auto";

export type SegurosQuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant?: SegurosQuoteModalVariant;
};

type QuoteModalAnalytics = {
  trackModalOpen: () => void;
  trackModalClose: () => void;
  trackFormStep: (step: number) => void;
  trackFormSubmit: (params: { vehicle_type: string; vehicle_use: string }) => void;
};

const QUOTE_MODAL_ANALYTICS: Record<SegurosQuoteModalVariant, QuoteModalAnalytics> = {
  seguros: {
    trackModalOpen: trackSegurosModalOpen,
    trackModalClose: trackSegurosModalClose,
    trackFormStep: trackSegurosFormStep,
    trackFormSubmit: trackSegurosFormSubmit,
  },
  "seguro-auto": {
    trackModalOpen: trackSeguroAutoModalOpen,
    trackModalClose: trackSeguroAutoModalClose,
    trackFormStep: trackSeguroAutoFormStep,
    trackFormSubmit: trackSeguroAutoFormSubmit,
  },
};

const STEPS = [
  { id: 1, label: "Veículo" },
  { id: 2, label: "Seus dados" },
  { id: 3, label: "Endereço" },
  { id: 4, label: "Concluído" },
] as const;

type QuoteStep = (typeof STEPS)[number]["id"];

const SEGUROS_CRM_SESSION_STORAGE_KEY = "seguros-crm-lead-session";
const SEGUROS_CRM_LEAD_ID_STORAGE_KEY = "seguros-crm-lead-id";

function createCrmSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `seguros-${Date.now()}`;
}

function startCrmSession(): string {
  const next = createCrmSessionId();
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SEGUROS_CRM_SESSION_STORAGE_KEY, next);
    sessionStorage.removeItem(SEGUROS_CRM_LEAD_ID_STORAGE_KEY);
  }
  return next;
}

function persistCrmLeadId(leadId: number): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SEGUROS_CRM_LEAD_ID_STORAGE_KEY, String(leadId));
}

function clearCrmLeadId(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SEGUROS_CRM_LEAD_ID_STORAGE_KEY);
}

function ArrowRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 448 512" fill="currentColor" aria-hidden>
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}

function FormGroup({
  id,
  label,
  error,
  required = true,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`igf-group${error ? " has-error" : ""}`} id={id}>
      <label htmlFor={`${id}-field`}>
        {label}
        {required && <span className="igf-req">*</span>}
      </label>
      {children}
      {error && <div className="igf-error-msg">{error}</div>}
    </div>
  );
}

export function SegurosQuoteModal({
  isOpen,
  onClose,
  variant = "seguros",
}: SegurosQuoteModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<QuoteStep>(1);
  const [values, setValues] = useState<SegurosQuoteFormValues>(SEGUROS_QUOTE_FORM_DEFAULTS);
  const [errors, setErrors] = useState<SegurosQuoteFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);
  const [crmSessionId, setCrmSessionId] = useState("");
  const [crmLeadId, setCrmLeadId] = useState<number | null>(null);
  const [crmError, setCrmError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setStep(1);
    setValues(SEGUROS_QUOTE_FORM_DEFAULTS);
    setErrors({});
    setIsSubmitting(false);
    setIsSyncingCrm(false);
    setCrmError(null);
  }, []);

  const handleClose = useCallback(() => {
    QUOTE_MODAL_ANALYTICS[variant].trackModalClose();
    resetForm();
    onClose();
  }, [variant, onClose, resetForm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (variant === "seguros") {
        // Libera eventos do funil para a próxima abertura do modal
        resetMetaPixelOnceKeys("InitiateCheckout:");
        resetMetaPixelOnceKeys("Step_2_DadosPessoais:");
        resetMetaPixelOnceKeys("Step_3_Resumo:");
        resetMetaPixelOnceKeys("Lead:");
      }
      return;
    }

    QUOTE_MODAL_ANALYTICS[variant].trackModalOpen();
    if (variant === "seguros") {
      trackSegurosMetaInitiateCheckout();
    }
  }, [isOpen, variant]);

  useEffect(() => {
    if (!isOpen) return;
    setCrmSessionId(startCrmSession());
    setCrmLeadId(null);
    const session = loadQuoteSessionFields();
    if (session) {
      setValues((current) => ({ ...current, ...session }));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleClose, isOpen]);

  const updateField = <K extends keyof SegurosQuoteFormValues>(
    field: K,
    value: SegurosQuoteFormValues[K]
  ) => {
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === "name" || field === "phone") {
        persistQuoteSessionFields({ name: next.name, phone: next.phone });
      }
      return next;
    });
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (crmError) setCrmError(null);
  };

  const syncLeadToCrm = useCallback(
    async (stepName: "vehicle" | "contact") => {
      setIsSyncingCrm(true);
      setCrmError(null);

      try {
        const sessionId = crmSessionId;
        if (!sessionId) {
          throw new Error("Sessão do formulário indisponível");
        }

        const response = await fetch("/api/seguros/crm-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step: stepName,
            session_id: sessionId,
            crm_lead_id: crmLeadId ?? undefined,
            funil: variant === "seguro-auto" ? "seguro-auto" : "seguros",
            attribution: readStoredAttribution(),
            values,
          }),
        });

        const body = await response.json().catch(() => null);
        if (!response.ok || body?.success === false) {
          throw new Error(body?.error || `CRM HTTP ${response.status}`);
        }

        const leadId = body?.data?.lead_id;
        if (typeof leadId === "number" && leadId > 0) {
          setCrmLeadId(leadId);
          persistCrmLeadId(leadId);
        }

        return body?.data;
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Não foi possível registrar seus dados no CRM.";
        setCrmError(message);
        throw error;
      } finally {
        setIsSyncingCrm(false);
      }
    },
    [crmLeadId, crmSessionId, values, variant]
  );

  const goStep = async (nextStep: 1 | 2 | 3) => {
    if (nextStep > step) {
      const stepErrors = validateQuoteStep(step as 1 | 2 | 3, values);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      if (step === 1) {
        try {
          await syncLeadToCrm("vehicle");
        } catch {
          return;
        }
        if (variant === "seguros") {
          trackSegurosMetaStep2({
            vehicle_brand: values.model.trim(),
            usage_type: mapUsageType(values.vehicleUse),
          });
        }
      }
      if (step === 2 && variant === "seguros") {
        trackSegurosMetaStep3();
      }
    }

    setErrors({});
    if (nextStep > step) {
      QUOTE_MODAL_ANALYTICS[variant].trackFormStep(step);
    }
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    const stepErrors = validateQuoteStep(3, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setCrmError(null);

    try {
      const crmData = await syncLeadToCrm("contact");
      const representativeLink =
        typeof crmData?.representative_link === "string"
          ? crmData.representative_link.trim()
          : "";

      QUOTE_MODAL_ANALYTICS[variant].trackFormStep(3);
      QUOTE_MODAL_ANALYTICS[variant].trackFormSubmit({
        vehicle_type: values.vehicleType,
        vehicle_use: values.vehicleUse,
      });

      if (variant === "seguros") {
        trackSegurosMetaLead({
          email: values.email,
          phone: values.phone,
          name: values.name,
          vehicle_brand: values.model.trim(),
          vehicle_year: extractVehicleYear(values.model),
          usage_type: mapUsageType(values.vehicleUse),
        });
      }

      if (typeof window !== "undefined") {
        sessionStorage.removeItem(SEGUROS_CRM_SESSION_STORAGE_KEY);
        clearCrmLeadId();
      }

      setStep(4);
      QUOTE_MODAL_ANALYTICS[variant].trackFormStep(4);

      if (representativeLink) {
        window.open(representativeLink, "_blank", "noopener,noreferrer");
      }
    } catch {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="seguros-quote-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="seguros-quote-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
        >
          <motion.div
            className="seguros-quote-modal-shell"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
          >
            <button
              type="button"
              className="seguros-quote-modal-close"
              onClick={handleClose}
              aria-label="Fechar formulário"
            >
              <X className="h-5 w-5" />
            </button>

            <div id="igform-wrap">
              <div className="igf-card">
                <div className="igf-header">
                  <div className="igf-badge">
                    <span className="igf-dot" />
                    <span>iGreen Seguros · Cotação Gratuita</span>
                  </div>

                  <h2 className="igf-title" id="seguros-quote-modal-title">
                    {step === 4 ? (
                      <>Solicitação enviada com <em>sucesso!</em></>
                    ) : step === 3 ? (
                      <>Diga onde seu veículo fica <em>estacionado</em></>
                    ) : (
                      <>
                        Receba sua cotação personalizada em{" "}
                        <em>minutos no WhatsApp</em>
                      </>
                    )}
                  </h2>
                  {step !== 4 && (
                    <p className="igf-sub">
                      {step === 3
                        ? "Com o endereço, conseguimos ajustar o melhor valor ideal para sua região."
                        : "Preencha os dados abaixo · Sem consulta no SPC/Serasa · Sem compromisso"}
                    </p>
                  )}

                  <div className="igf-steps" id="igf-steps-header">
                    {STEPS.map(({ id, label }) => {
                      const isActive = step === id;
                      const isDone = step > id;

                      return (
                        <div
                          key={id}
                          className={`igf-step-item${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                        >
                          <div className="igf-step-num">{id}</div>
                          <div className="igf-step-label">{label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="igf-body">
                  {crmError && (
                    <div className="igf-crm-error" role="alert">
                      {crmError}
                    </div>
                  )}

                  {step === 1 && (
                    <div id="igf-ws-1">
                      <FormGroup id="w-grp-tipo" label="Tipo do veículo" error={errors.vehicleType}>
                        <select
                          id="w-grp-tipo-field"
                          className={`igf-select${errors.vehicleType ? " error" : ""}`}
                          value={values.vehicleType}
                          onChange={(event) => updateField("vehicleType", event.target.value)}
                        >
                          <option value="">Selecione o tipo...</option>
                          {SEGUROS_VEHICLE_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </FormGroup>

                      <div className="igf-row">
                        <FormGroup id="w-grp-placa" label="Placa" error={errors.plate}>
                          <input
                            id="w-grp-placa-field"
                            type="text"
                            className={`igf-input${errors.plate ? " error" : ""}`}
                            placeholder="ABC-1D23"
                            maxLength={8}
                            value={values.plate}
                            onChange={(event) => updateField("plate", maskPlate(event.target.value))}
                          />
                        </FormGroup>

                        <FormGroup id="w-grp-modelo" label="Marca e modelo" error={errors.model}>
                          <input
                            id="w-grp-modelo-field"
                            type="text"
                            className={`igf-input${errors.model ? " error" : ""}`}
                            placeholder="Ex: Honda Civic 2020"
                            value={values.model}
                            onChange={(event) => updateField("model", event.target.value)}
                          />
                        </FormGroup>
                      </div>

                      <FormGroup
                        id="w-grp-uso"
                        label="Você utiliza esse veículo para Aplicativo ou Táxi?"
                        error={errors.vehicleUse}
                      >
                        <select
                          id="w-grp-uso-field"
                          className={`igf-select${errors.vehicleUse ? " error" : ""}`}
                          value={values.vehicleUse}
                          onChange={(event) => updateField("vehicleUse", event.target.value)}
                        >
                          <option value="">Selecione...</option>
                          {SEGUROS_YES_NO_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormGroup>

                      <FormGroup
                        id="w-grp-garagem"
                        label="Você possui garagem própria para pernoite do veículo?"
                        error={errors.garage}
                      >
                        <select
                          id="w-grp-garagem-field"
                          className={`igf-select${errors.garage ? " error" : ""}`}
                          value={values.garage}
                          onChange={(event) => updateField("garage", event.target.value)}
                        >
                          <option value="">Selecione...</option>
                          {SEGUROS_YES_NO_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormGroup>

                      <FormGroup id="w-grp-nome-veiculo" label="Nome completo" error={errors.name}>
                        <input
                          id="w-grp-nome-veiculo-field"
                          type="text"
                          className={`igf-input${errors.name ? " error" : ""}`}
                          placeholder="Seu nome completo"
                          autoComplete="name"
                          value={values.name}
                          onChange={(event) => updateField("name", event.target.value)}
                        />
                      </FormGroup>

                      <FormGroup id="w-grp-tel-veiculo" label="WhatsApp" error={errors.phone}>
                        <input
                          id="w-grp-tel-veiculo-field"
                          type="tel"
                          className={`igf-input${errors.phone ? " error" : ""}`}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                          inputMode="numeric"
                          value={values.phone}
                          onChange={(event) => updateField("phone", maskPhone(event.target.value))}
                        />
                      </FormGroup>

                      <div className="igf-btn-row">
                        <button
                          type="button"
                          className={`igf-btn igf-btn-green${isSyncingCrm ? " loading" : ""}`}
                          onClick={() => void goStep(2)}
                          disabled={isSyncingCrm}
                        >
                          <span className="igf-btn-text" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {isSyncingCrm ? "Registrando..." : "Continuar"}
                            <span className="igf-arrow">
                              <ArrowRightIcon />
                            </span>
                          </span>
                          <span className="igf-spinner" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div id="igf-ws-2">
                      <FormGroup id="w-grp-nome" label="Nome completo" error={errors.name}>
                        <input
                          id="w-grp-nome-field"
                          type="text"
                          className={`igf-input igf-input-locked${errors.name ? " error" : ""}`}
                          placeholder="Seu nome completo"
                          autoComplete="name"
                          value={values.name}
                          readOnly
                          aria-readonly="true"
                        />
                      </FormGroup>

                      <FormGroup id="w-grp-cpf" label="CPF/CNPJ" error={errors.cpfCnpj}>
                        <input
                          id="w-grp-cpf-field"
                          type="text"
                          className={`igf-input${errors.cpfCnpj ? " error" : ""}`}
                          placeholder="000.000.000-00"
                          maxLength={18}
                          inputMode="numeric"
                          value={values.cpfCnpj}
                          onChange={(event) => updateField("cpfCnpj", maskCpfCnpj(event.target.value))}
                        />
                      </FormGroup>

                      <FormGroup id="w-grp-nascimento" label="Data de Nascimento" error={errors.birthDate}>
                        <input
                          id="w-grp-nascimento-field"
                          type="text"
                          className={`igf-input${errors.birthDate ? " error" : ""}`}
                          placeholder="DD/MM/AAAA"
                          maxLength={10}
                          inputMode="numeric"
                          autoComplete="bday"
                          value={values.birthDate}
                          onChange={(event) =>
                            updateField("birthDate", maskBirthDate(event.target.value))
                          }
                        />
                      </FormGroup>

                      <FormGroup id="w-grp-email" label="E-mail" error={errors.email}>
                        <input
                          id="w-grp-email-field"
                          type="email"
                          className={`igf-input${errors.email ? " error" : ""}`}
                          placeholder="seu@email.com"
                          autoComplete="email"
                          value={values.email}
                          onChange={(event) => updateField("email", event.target.value)}
                        />
                      </FormGroup>

                      <FormGroup id="w-grp-tel" label="WhatsApp" error={errors.phone}>
                        <input
                          id="w-grp-tel-field"
                          type="tel"
                          className={`igf-input igf-input-locked${errors.phone ? " error" : ""}`}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                          inputMode="numeric"
                          value={values.phone}
                          readOnly
                          aria-readonly="true"
                        />
                      </FormGroup>

                      <div className="igf-btn-row">
                        <button
                          type="button"
                          className="igf-btn igf-btn-ghost"
                          onClick={() => void goStep(1)}
                          aria-label="Voltar"
                        >
                          <ArrowLeftIcon />
                        </button>
                        <button
                          type="button"
                          className="igf-btn igf-btn-green"
                          onClick={() => void goStep(3)}
                        >
                          <span className="igf-btn-text" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            Continuar
                            <span className="igf-arrow">
                              <ArrowRightIcon />
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div id="igf-ws-3">
                      <FormGroup id="w-grp-endereco" label="Endereço Completo" error={errors.address}>
                        <input
                          id="w-grp-endereco-field"
                          type="text"
                          className={`igf-input${errors.address ? " error" : ""}`}
                          placeholder="Rua, avenida..."
                          autoComplete="street-address"
                          value={values.address}
                          onChange={(event) => updateField("address", event.target.value)}
                        />
                      </FormGroup>

                      <div className="igf-row">
                        <FormGroup id="w-grp-numero" label="Número do endereço" error={errors.addressNumber}>
                          <input
                            id="w-grp-numero-field"
                            type="text"
                            className={`igf-input${errors.addressNumber ? " error" : ""}`}
                            placeholder="Nº"
                            autoComplete="address-line2"
                            value={values.addressNumber}
                            onChange={(event) => updateField("addressNumber", event.target.value)}
                          />
                        </FormGroup>

                        <FormGroup id="w-grp-cep" label="CEP" error={errors.cep}>
                          <input
                            id="w-grp-cep-field"
                            type="text"
                            className={`igf-input${errors.cep ? " error" : ""}`}
                            placeholder="00000-000"
                            maxLength={9}
                            inputMode="numeric"
                            autoComplete="postal-code"
                            value={values.cep}
                            onChange={(event) => updateField("cep", maskCep(event.target.value))}
                          />
                        </FormGroup>
                      </div>

                      <FormGroup
                        id="w-grp-complemento"
                        label="Complemento"
                        error={errors.complement}
                        required={false}
                      >
                        <input
                          id="w-grp-complemento-field"
                          type="text"
                          className={`igf-input${errors.complement ? " error" : ""}`}
                          placeholder="Apto, bloco, referência..."
                          value={values.complement}
                          onChange={(event) => updateField("complement", event.target.value)}
                        />
                      </FormGroup>

                      <div className="igf-btn-row">
                        <button
                          type="button"
                          className="igf-btn igf-btn-ghost"
                          onClick={() => void goStep(2)}
                          aria-label="Voltar"
                        >
                          <ArrowLeftIcon />
                        </button>
                      </div>

                      <div className="igf-btn-wrap">
                        <button
                          type="button"
                          className={`igf-btn igf-btn-wpp${isSubmitting ? " loading" : ""}`}
                          onClick={handleSubmit}
                          disabled={isSubmitting || isSyncingCrm}
                        >
                          <span className="igf-btn-text" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <WhatsAppIcon />
                            Receber cotação no WhatsApp
                          </span>
                          <span className="igf-spinner" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div id="igf-ws-4" className="igf-success">
                      <div className="igf-success-icon" aria-hidden>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>

                      <p className="igf-success-intro">
                        Recebemos suas informações e sua solicitação já está sendo processada.
                      </p>
                      <p className="igf-success-intro">
                        Nos próximos minutos, você receberá uma mensagem de um de nossos especialistas
                        diretamente no WhatsApp para dar continuidade à sua cotação.
                      </p>

                      <h3 className="igf-success-heading">O que acontece agora?</h3>
                      <ul className="igf-success-list">
                        <li>Analisaremos suas informações.</li>
                        <li>Entraremos em contato pelo WhatsApp cadastrado.</li>
                        <li>Entenderemos melhor suas necessidades.</li>
                        <li>Apresentaremos as melhores opções de seguro para você.</li>
                      </ul>

                      <p className="igf-success-whatsapp">
                        📱 Fique atento às suas mensagens no WhatsApp.
                      </p>

                      <p className="igf-success-thanks">
                        Obrigado pela confiança! Em breve nossa equipe falará com você.
                      </p>

                      <div className="igf-btn-wrap">
                        <button type="button" className="igf-btn igf-btn-green" onClick={handleClose}>
                          Fechar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {step !== 4 && (
                  <div className="igf-footer">
                    <div className="igf-footer-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      Seus dados estão protegidos pela LGPD. Não enviamos spam.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
