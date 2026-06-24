import { TELECOM_WHATSAPP_URL } from "@/lib/telecom/constants";

export const TELECOM_QUOTE_SESSION_KEY = "telecom-quote-form-session";

export const TELECOM_PLAN_TYPES = [
  { value: "mobile", label: "Telefonia móvel" },
  { value: "internet", label: "Internet móvel" },
  { value: "combo", label: "Combo móvel + benefícios" },
] as const;

export const TELECOM_DATA_OPTIONS = [
  { value: "15", label: "15 GB" },
  { value: "30", label: "30 GB" },
  { value: "60", label: "60 GB" },
  { value: "100", label: "100 GB" },
] as const;

export const TELECOM_PORTABILITY_OPTIONS = [
  { value: "yes", label: "Sim, quero manter meu número" },
  { value: "no", label: "Não, quero número novo" },
] as const;

export type TelecomQuoteFormValues = {
  planType: string;
  dataGb: string;
  portability: string;
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  cep: string;
};

export type TelecomQuoteFieldErrors = Partial<Record<keyof TelecomQuoteFormValues, string>>;

export const TELECOM_QUOTE_FORM_DEFAULTS: TelecomQuoteFormValues = {
  planType: "",
  dataGb: "",
  portability: "",
  name: "",
  cpfCnpj: "",
  email: "",
  phone: "",
  cep: "",
};

export function validateTelecomQuoteStep(
  step: 1 | 2,
  values: TelecomQuoteFormValues
): TelecomQuoteFieldErrors {
  const errors: TelecomQuoteFieldErrors = {};

  if (step === 1) {
    if (!values.planType) errors.planType = "Selecione o tipo de plano";
    if (!values.dataGb) errors.dataGb = "Selecione a quantidade de dados";
    if (!values.portability) errors.portability = "Informe se deseja portabilidade";
  }

  if (step === 2) {
    if (!values.name.trim() || values.name.trim().length < 3) {
      errors.name = "Informe seu nome completo";
    }
    const phoneDigits = values.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) errors.phone = "Telefone inválido";
    const cpfDigits = values.cpfCnpj.replace(/\D/g, "");
    if (cpfDigits.length < 11) errors.cpfCnpj = "CPF/CNPJ inválido";
    const cepDigits = values.cep.replace(/\D/g, "");
    if (cepDigits.length < 8) errors.cep = "CEP inválido";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "E-mail inválido";
    }
  }

  return errors;
}

export function persistTelecomQuoteSessionFields(values: Pick<TelecomQuoteFormValues, "name" | "phone">) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    TELECOM_QUOTE_SESSION_KEY,
    JSON.stringify({ name: values.name, phone: values.phone })
  );
}

export function loadTelecomQuoteSessionFields(): Pick<TelecomQuoteFormValues, "name" | "phone"> {
  if (typeof window === "undefined") return { name: "", phone: "" };
  try {
    const raw = sessionStorage.getItem(TELECOM_QUOTE_SESSION_KEY);
    if (!raw) return { name: "", phone: "" };
    return JSON.parse(raw) as Pick<TelecomQuoteFormValues, "name" | "phone">;
  } catch {
    return { name: "", phone: "" };
  }
}

export function buildTelecomWhatsAppUrl(values: TelecomQuoteFormValues): string {
  const planLabel =
    TELECOM_PLAN_TYPES.find((p) => p.value === values.planType)?.label ?? values.planType;
  const dataLabel =
    TELECOM_DATA_OPTIONS.find((d) => d.value === values.dataGb)?.label ?? `${values.dataGb} GB`;
  const portLabel =
    values.portability === "yes" ? "Sim, com portabilidade" : "Não, número novo";

  const message = [
    "Olá! Quero contratar o Telecom iGreen.",
    "",
    `Plano: ${planLabel}`,
    `Dados: ${dataLabel}`,
    `Portabilidade: ${portLabel}`,
    `Nome: ${values.name}`,
    `WhatsApp: ${values.phone}`,
    values.email ? `E-mail: ${values.email}` : null,
    values.cpfCnpj ? `CPF/CNPJ: ${values.cpfCnpj}` : null,
    values.cep ? `CEP: ${values.cep}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const base = TELECOM_WHATSAPP_URL.split("?")[0];
  return `${base}?text=${encodeURIComponent(message)}`;
}
