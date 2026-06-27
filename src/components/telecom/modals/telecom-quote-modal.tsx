"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { maskCpfCnpj, maskPhone } from "@/lib/masks";
import {
  formatTelecomPrice,
  getTelecomPlansForActivation,
  TELECOM_ACTIVATION_OPTIONS,
  TELECOM_CHIP_OPTIONS,
  TELECOM_DDD_OPTIONS,
  TELECOM_OPERATORS,
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
  trackTelecomPlanSelect,
} from "@/lib/telecom/analytics";
import "@/app/telecom/telecom-quote-modal.css";

export type TelecomQuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const STEPS = [
  { id: 1, label: "Tipo" },
  { id: 2, label: "Dados" },
  { id: 3, label: "Plano" },
  { id: 4, label: "Concluído" },
] as const;

type QuoteStep = (typeof STEPS)[number]["id"];

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
    <div className={`tqf-group${error ? " has-error" : ""}`} id={id}>
      <label htmlFor={`${id}-field`}>
        {label} {required && <span className="req">*</span>}
      </label>
      {children}
      {error && <div className="tqf-error">{error}</div>}
    </div>
  );
}

export function TelecomQuoteModal({ isOpen, onClose }: TelecomQuoteModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<QuoteStep>(1);
  const [values, setValues] = useState<TelecomQuoteFormValues>(TELECOM_QUOTE_FORM_DEFAULTS);
  const [errors, setErrors] = useState<TelecomQuoteFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);
  const [crmError, setCrmError] = useState<string | null>(null);
  const [crmSessionId, setCrmSessionId] = useState("");

  const resetForm = useCallback(() => {
    setStep(1);
    setValues(TELECOM_QUOTE_FORM_DEFAULTS);
    setErrors({});
    setIsSubmitting(false);
    setIsSyncingCrm(false);
    setCrmError(null);
  }, []);

  const handleClose = useCallback(() => {
    trackTelecomModalClose();
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      trackTelecomModalOpen();
      setCrmSessionId(getOrCreateCrmSessionId());
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
  }, [isOpen, handleClose]);

  const updateField = <K extends keyof TelecomQuoteFormValues>(
    field: K,
    value: TelecomQuoteFormValues[K]
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const syncCrm = async (
    crmStep: "activation" | "details" | "contact",
    payloadValues: TelecomQuoteFormValues = values
  ) => {
    setIsSyncingCrm(true);
    try {
      const res = await fetch("/api/telecom/crm-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: crmStep,
          session_id: crmSessionId,
          values: payloadValues,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Erro ao sincronizar lead");
      }
      setCrmError(null);
    } catch (err) {
      setCrmError(err instanceof Error ? err.message : "Erro ao sincronizar lead");
    } finally {
      setIsSyncingCrm(false);
    }
  };

  const selectActivationType = async (activationType: "portabilidade" | "linha_nova") => {
    const nextValues = {
      ...values,
      activationType,
      portNumber: "",
      currentOperator: "",
      ddd: "",
      selectedPlan: "",
    };
    setValues(nextValues);
    setErrors({});
    trackTelecomFormStep(1);
    await syncCrm("activation", nextValues);
    setStep(2);
  };

  const goToStep3 = async () => {
    const stepErrors = validateTelecomQuoteStep(2, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    trackTelecomFormStep(2);
    await syncCrm("details");
    setStep(3);
  };

  const handleSubmit = async () => {
    const stepErrors = validateTelecomQuoteStep(3, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    trackTelecomFormStep(3);
    trackTelecomFormSubmit({
      plan_type: values.selectedPlan,
      portability: values.activationType === "portabilidade" ? "yes" : "no",
    });
    trackTelecomPlanSelect(values.selectedPlan);
    await syncCrm("contact");
    sessionStorage.removeItem(TELECOM_CRM_SESSION_STORAGE_KEY);
    setIsSubmitting(false);
    setStep(4);
  };

  const plans = getTelecomPlansForActivation(values.activationType);
  const subtitleByStep: Record<QuoteStep, string> = {
    1: "Como deseja ativar sua linha?",
    2: "Informe seus dados para continuar",
    3: "Escolha o seu plano",
    4: "Solicitação enviada com sucesso!",
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
            className={`telecom-quote-modal-shell${step === 3 ? " telecom-quote-modal-shell-wide" : ""}`}
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
              <h2>{step === 4 ? "Solicitação enviada com sucesso!" : "Ativar Telecom iGreen"}</h2>
              <p className="subtitle">{subtitleByStep[step]}</p>

              {step !== 4 && (
                <div className="tqf-steps">
                  {STEPS.slice(0, 3).map((s) => (
                    <div key={s.id} className={`tqf-step${step >= s.id ? " active" : ""}`} />
                  ))}
                </div>
              )}

              {step === 1 && (
                <>
                  <div className="tqf-type-buttons">
                    {TELECOM_ACTIVATION_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="tqf-type-btn"
                        onClick={() => void selectActivationType(option.value)}
                        disabled={isSyncingCrm}
                      >
                        <span className="tqf-type-btn-label">{option.label}</span>
                        <span className="tqf-type-btn-desc">{option.description}</span>
                      </button>
                    ))}
                  </div>
                  {errors.activationType && (
                    <div className="tqf-error tqf-error-block">{errors.activationType}</div>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <FormGroup id="cpfCnpj" label="CPF ou CNPJ" error={errors.cpfCnpj}>
                    <input
                      id="cpfCnpj-field"
                      type="text"
                      value={values.cpfCnpj}
                      onChange={(e) => updateField("cpfCnpj", maskCpfCnpj(e.target.value))}
                      placeholder="000.000.000-00"
                    />
                  </FormGroup>

                  <FormGroup id="chipType" label="Tipo do chip" error={errors.chipType}>
                    <select
                      id="chipType-field"
                      value={values.chipType}
                      onChange={(e) =>
                        updateField("chipType", e.target.value as TelecomQuoteFormValues["chipType"])
                      }
                    >
                      <option value="">Selecione</option>
                      {TELECOM_CHIP_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  {values.activationType === "portabilidade" && (
                    <>
                      <FormGroup
                        id="portNumber"
                        label="Número a ser portado com DDD"
                        error={errors.portNumber}
                      >
                        <input
                          id="portNumber-field"
                          type="tel"
                          value={values.portNumber}
                          onChange={(e) =>
                            updateField("portNumber", maskPhone(e.target.value))
                          }
                          placeholder="(00) 00000-0000"
                        />
                      </FormGroup>

                      <FormGroup
                        id="currentOperator"
                        label="Operadora Atual"
                        error={errors.currentOperator}
                      >
                        <select
                          id="currentOperator-field"
                          value={values.currentOperator}
                          onChange={(e) => updateField("currentOperator", e.target.value)}
                        >
                          <option value="">Selecione</option>
                          {TELECOM_OPERATORS.map((operator) => (
                            <option key={operator} value={operator}>
                              {operator}
                            </option>
                          ))}
                        </select>
                      </FormGroup>
                    </>
                  )}

                  {values.activationType === "linha_nova" && (
                    <FormGroup id="ddd" label="DDD" error={errors.ddd}>
                      <select
                        id="ddd-field"
                        value={values.ddd}
                        onChange={(e) => updateField("ddd", e.target.value)}
                      >
                        <option value="">Selecione</option>
                        {TELECOM_DDD_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FormGroup>
                  )}

                  <div className="tqf-actions">
                    <button
                      type="button"
                      className="tqf-btn-secondary"
                      onClick={() => setStep(1)}
                      disabled={isSyncingCrm}
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      className="tqf-btn-primary"
                      onClick={() => void goToStep3()}
                      disabled={isSyncingCrm}
                    >
                      {isSyncingCrm ? "Registrando..." : "Continuar"}
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className={`tqf-plans-scroll${errors.selectedPlan ? " has-error" : ""}`}>
                    {plans.map((plan) => {
                      const isSelected = values.selectedPlan === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          className={`tqf-plan-card${isSelected ? " selected" : ""}`}
                          onClick={() => updateField("selectedPlan", plan.id)}
                        >
                          {isSelected && (
                            <span className="tqf-plan-selected-badge" aria-hidden>
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          )}
                          <span className="tqf-plan-name">Plano {plan.name}</span>
                          <span className="tqf-plan-data">{plan.dataMain}</span>
                          {plan.dataBonus && (
                            <span className="tqf-plan-bonus">{plan.dataBonus}</span>
                          )}
                          {plan.dataDetail && (
                            <span className="tqf-plan-detail">{plan.dataDetail}</span>
                          )}
                          <ul className="tqf-plan-features">
                            {plan.features.map((feature) => (
                              <li key={feature}>{feature}</li>
                            ))}
                          </ul>
                          <span className="tqf-plan-price">
                            {formatTelecomPrice(plan.price)}
                            <small>/mês</small>
                          </span>
                          {plan.priceNote && (
                            <span className="tqf-plan-note">{plan.priceNote}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.selectedPlan && (
                    <div className="tqf-error tqf-error-block">{errors.selectedPlan}</div>
                  )}

                  <div className="tqf-actions">
                    <button
                      type="button"
                      className="tqf-btn-secondary"
                      onClick={() => setStep(2)}
                      disabled={isSubmitting}
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      className="tqf-btn-primary"
                      onClick={() => void handleSubmit()}
                      disabled={isSubmitting || isSyncingCrm}
                    >
                      {isSubmitting ? "Enviando..." : "Finalizar solicitação"}
                    </button>
                  </div>
                </>
              )}

              {step === 4 && (
                <div className="tqf-success">
                  <div className="tqf-success-icon" aria-hidden>
                    <Check className="h-7 w-7" />
                  </div>

                  <p className="tqf-success-intro">
                    Recebemos seus dados e sua solicitação já está em andamento.
                  </p>
                  <p className="tqf-success-intro">
                    Nos próximos instantes, um de nossos especialistas entrará em contato pelo
                    WhatsApp para finalizar sua contratação.
                  </p>

                  <h3 className="tqf-success-heading">Próximos passos:</h3>
                  <ul className="tqf-success-list">
                    <li>Conferência das informações enviadas.</li>
                    <li>Atendimento personalizado via WhatsApp.</li>
                    <li>
                      Orientação sobre a portabilidade ou ativação de um novo número.
                    </li>
                    <li>Finalização da contratação de forma rápida e segura.</li>
                  </ul>

                  <p className="tqf-success-whatsapp">
                    📲 Fique atento ao WhatsApp cadastrado. Nossa equipe utilizará esse canal para
                    dar continuidade ao seu atendimento.
                  </p>

                  <p className="tqf-success-thanks">
                    Obrigado por escolher nossos serviços. Em breve falaremos com você!
                  </p>

                  <div className="tqf-actions tqf-actions-single">
                    <button type="button" className="tqf-btn-primary" onClick={handleClose}>
                      Fechar
                    </button>
                  </div>
                </div>
              )}

              {crmError && step !== 4 && <div className="tqf-crm-error">{crmError}</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
