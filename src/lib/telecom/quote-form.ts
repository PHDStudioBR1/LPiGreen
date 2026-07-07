export const TELECOM_QUOTE_SESSION_KEY = "telecom-quote-form-session";

export type TelecomActivationType = "portabilidade" | "linha_nova";

export type TelecomChipType = "esim" | "fisico";

export type TelecomFormPlan = {
  id: string;
  name: string;
  dataMain: string;
  dataBonus?: string;
  dataDetail?: string;
  features: string[];
  price: number;
  priceNote?: string;
};

export const TELECOM_ACTIVATION_OPTIONS = [
  { value: "portabilidade" as const, label: "Portabilidade", description: "Traga seu número atual" },
  { value: "linha_nova" as const, label: "Linha Nova", description: "Ative um novo número" },
];

export const TELECOM_CHIP_OPTIONS = [
  {
    value: "esim" as const,
    label: "eSIM (Digital)",
    description: "Ativação 100% digital, sem chip físico.",
  },
  {
    value: "fisico" as const,
    label: "Físico (enviaremos seu chip para o endereço cadastrado após a ativação)",
    description: "Enviaremos seu chip para o endereço cadastrado após a ativação.",
  },
];

export const TELECOM_OPERATORS = [
  "Algar",
  "Americanet Movil",
  "Claro",
  "Nextel",
  "Oi",
  "Surf Telecom",
  "Telecal",
  "Tim",
  "Vivo",
] as const;

export const TELECOM_DDD_OPTIONS = [
  { value: "11", label: "SP 11" },
  { value: "12", label: "SP 12" },
  { value: "13", label: "SP 13" },
  { value: "14", label: "SP 14" },
  { value: "15", label: "SP 15" },
  { value: "16", label: "SP 16" },
  { value: "17", label: "SP 17" },
  { value: "18", label: "SP 18" },
  { value: "19", label: "SP 19" },
  { value: "21", label: "RJ 21" },
  { value: "22", label: "RJ 22" },
  { value: "24", label: "RJ 24" },
  { value: "27", label: "ES 27" },
  { value: "28", label: "ES 28" },
  { value: "31", label: "MG 31" },
  { value: "32", label: "MG 32" },
  { value: "33", label: "MG 33" },
  { value: "34", label: "MG 34" },
  { value: "35", label: "MG 35" },
  { value: "37", label: "MG 37" },
  { value: "38", label: "MG 38" },
  { value: "41", label: "PR 41" },
  { value: "42", label: "PR 42" },
  { value: "43", label: "PR 43" },
  { value: "44", label: "PR 44" },
  { value: "45", label: "PR 45" },
  { value: "46", label: "PR 46" },
  { value: "47", label: "SC 47" },
  { value: "48", label: "SC 48" },
  { value: "49", label: "SC 49" },
  { value: "51", label: "RS 51" },
  { value: "53", label: "RS 53" },
  { value: "54", label: "RS 54" },
  { value: "55", label: "RS 55" },
  { value: "61", label: "DF 61" },
  { value: "62", label: "GO 62" },
  { value: "64", label: "GO 64" },
  { value: "63", label: "TO 63" },
  { value: "65", label: "MT 65" },
  { value: "66", label: "MT 66" },
  { value: "67", label: "MS 67" },
  { value: "68", label: "AC 68" },
  { value: "69", label: "RO 69" },
  { value: "71", label: "BA 71" },
  { value: "73", label: "BA 73" },
  { value: "74", label: "BA 74" },
  { value: "75", label: "BA 75" },
  { value: "77", label: "BA 77" },
  { value: "79", label: "SE 79" },
  { value: "81", label: "PE 81" },
  { value: "87", label: "PE 87" },
  { value: "82", label: "AL 82" },
  { value: "83", label: "PB 83" },
  { value: "84", label: "RN 84" },
  { value: "85", label: "CE 85" },
  { value: "88", label: "CE 88" },
  { value: "86", label: "PI 86" },
  { value: "89", label: "PI 89" },
  { value: "91", label: "PA 91" },
  { value: "93", label: "PA 93" },
  { value: "94", label: "PA 94" },
  { value: "95", label: "RR 95" },
  { value: "96", label: "AP 96" },
  { value: "92", label: "AM 92" },
  { value: "97", label: "AM 97" },
  { value: "98", label: "MA 98" },
  { value: "99", label: "MA 99" },
] as const;

const BASE_FEATURES = [
  "Ligações ILIMITADAS",
  "Internet que ACUMULA",
  "Cobertura NACIONAL",
  "Internet sem CORTES",
  "WhatsApp ILIMITADO",
  "iGreen Club GRÁTIS",
] as const;

const BASE_FEATURES_WITH_WAZE = [...BASE_FEATURES, "Waze ILIMITADO"] as const;

export const TELECOM_PORTABILITY_PLANS: TelecomFormPlan[] = [
  {
    id: "start",
    name: "Start",
    dataMain: "11GB",
    dataBonus: "+5GB na port.",
    dataDetail: "6GB + 5GB",
    features: [...BASE_FEATURES],
    price: 54.9,
    priceNote: "Sem portabilidade R$ 59,90/mês com 6GB de dados.",
  },
  {
    id: "mega",
    name: "Mega",
    dataMain: "15GB",
    dataBonus: "+5GB na port.",
    dataDetail: "10GB + 5GB",
    features: [...BASE_FEATURES],
    price: 59.9,
    priceNote: "Sem portabilidade R$ 64,90/mês com 10GB de dados.",
  },
  {
    id: "giga",
    name: "Giga",
    dataMain: "20GB",
    dataBonus: "+5GB na port.",
    dataDetail: "15GB + 5GB",
    features: [...BASE_FEATURES_WITH_WAZE],
    price: 69.9,
    priceNote: "Sem portabilidade R$ 74,90/mês com 15GB de dados.",
  },
  {
    id: "ultra",
    name: "Ultra",
    dataMain: "28GB",
    dataBonus: "+5GB na port.",
    dataDetail: "23GB + 5GB",
    features: [...BASE_FEATURES_WITH_WAZE],
    price: 79.9,
    priceNote: "Sem portabilidade R$ 84,90/mês com 23GB de dados.",
  },
  {
    id: "infinity",
    name: "Infinity",
    dataMain: "50GB",
    dataBonus: "+5GB na port.",
    dataDetail: "45GB + 5GB",
    features: [...BASE_FEATURES_WITH_WAZE],
    price: 99.9,
    priceNote: "Sem portabilidade R$ 104,90/mês com 45GB de dados.",
  },
];

export const TELECOM_NEW_LINE_PLANS: TelecomFormPlan[] = [
  {
    id: "start",
    name: "Start",
    dataMain: "6GB",
    features: [...BASE_FEATURES],
    price: 59.9,
  },
  {
    id: "mega",
    name: "Mega",
    dataMain: "10GB",
    features: [...BASE_FEATURES],
    price: 64.9,
  },
  {
    id: "giga",
    name: "Giga",
    dataMain: "15GB",
    features: [...BASE_FEATURES_WITH_WAZE],
    price: 74.9,
  },
  {
    id: "ultra",
    name: "Ultra",
    dataMain: "23GB",
    features: [...BASE_FEATURES_WITH_WAZE],
    price: 84.9,
  },
  {
    id: "infinity",
    name: "Infinity",
    dataMain: "45GB",
    features: [...BASE_FEATURES_WITH_WAZE],
    price: 104.9,
  },
];

export type TelecomQuoteFormValues = {
  activationType: TelecomActivationType | "";
  name: string;
  email: string;
  cpfCnpj: string;
  chipType: TelecomChipType | "";
  portNumber: string;
  currentOperator: string;
  ddd: string;
  selectedPlan: string;
};

export type TelecomQuoteFieldErrors = Partial<Record<keyof TelecomQuoteFormValues, string>>;

export const TELECOM_QUOTE_FORM_DEFAULTS: TelecomQuoteFormValues = {
  activationType: "",
  name: "",
  email: "",
  cpfCnpj: "",
  chipType: "",
  portNumber: "",
  currentOperator: "",
  ddd: "",
  selectedPlan: "",
};

export function formatTelecomPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function getTelecomPlansForActivation(
  activationType: TelecomActivationType | ""
): TelecomFormPlan[] {
  if (activationType === "portabilidade") return TELECOM_PORTABILITY_PLANS;
  if (activationType === "linha_nova") return TELECOM_NEW_LINE_PLANS;
  return [];
}

export function getTelecomPlanById(
  activationType: TelecomActivationType | "",
  planId: string
): TelecomFormPlan | undefined {
  return getTelecomPlansForActivation(activationType).find((plan) => plan.id === planId);
}

export function validateTelecomQuoteStep(
  step: 1 | 2 | 3,
  values: TelecomQuoteFormValues
): TelecomQuoteFieldErrors {
  const errors: TelecomQuoteFieldErrors = {};

  if (step === 1) {
    if (!values.activationType) {
      errors.activationType = "Selecione Portabilidade ou Linha Nova";
    }
  }

  if (step === 2) {
    if (!values.name.trim()) errors.name = "Informe seu nome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Informe um e-mail válido";
    }
    const cpfDigits = values.cpfCnpj.replace(/\D/g, "");
    if (cpfDigits.length < 11) errors.cpfCnpj = "CPF/CNPJ inválido";
    if (!values.chipType) errors.chipType = "Selecione o tipo do chip";

    if (values.activationType === "portabilidade") {
      const portDigits = values.portNumber.replace(/\D/g, "");
      if (portDigits.length < 10) errors.portNumber = "Informe o número com DDD";
      if (!values.currentOperator) errors.currentOperator = "Selecione a operadora atual";
    }

    if (values.activationType === "linha_nova") {
      if (!values.ddd) errors.ddd = "Selecione o DDD";
    }
  }

  if (step === 3) {
    if (!values.selectedPlan) errors.selectedPlan = "Selecione um plano";
  }

  return errors;
}

export function buildTelecomLeadSummary(values: TelecomQuoteFormValues): string {
  const activationLabel =
    values.activationType === "portabilidade" ? "Portabilidade" : "Linha Nova";
  const chipLabel =
    TELECOM_CHIP_OPTIONS.find((option) => option.value === values.chipType)?.label ??
    values.chipType;
  const plan = getTelecomPlanById(values.activationType, values.selectedPlan);

  const lines = [
    `Nome: ${values.name}`,
    `E-mail: ${values.email}`,
    `Tipo: ${activationLabel}`,
    `CPF/CNPJ: ${values.cpfCnpj}`,
    `Chip: ${chipLabel}`,
    values.activationType === "portabilidade"
      ? `Número a portar: ${values.portNumber}`
      : null,
    values.activationType === "portabilidade"
      ? `Operadora atual: ${values.currentOperator}`
      : null,
    values.activationType === "linha_nova"
      ? `DDD: ${TELECOM_DDD_OPTIONS.find((option) => option.value === values.ddd)?.label ?? values.ddd}`
      : null,
    plan ? `Plano: ${plan.name} — ${plan.dataMain} — ${formatTelecomPrice(plan.price)}/mês` : null,
  ];

  return lines.filter(Boolean).join("\n");
}
