export const SEGUROS_VEHICLE_TYPES = [
  "Carro",
  "Moto",
] as const;

export const SEGUROS_YES_NO_OPTIONS = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
] as const;

export type SegurosQuoteFormValues = {
  vehicleType: string;
  plate: string;
  model: string;
  vehicleUse: string;
  garage: string;
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  cep: string;
};

export const SEGUROS_QUOTE_SESSION_STORAGE_KEY = "seguros-quote-form-session";

export type SegurosQuoteSessionFields = Pick<SegurosQuoteFormValues, "name" | "phone">;

export function loadQuoteSessionFields(): SegurosQuoteSessionFields | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SEGUROS_QUOTE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SegurosQuoteSessionFields>;
    if (typeof parsed.name !== "string" || typeof parsed.phone !== "string") return null;
    return { name: parsed.name, phone: parsed.phone };
  } catch {
    return null;
  }
}

export function persistQuoteSessionFields(fields: SegurosQuoteSessionFields): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SEGUROS_QUOTE_SESSION_STORAGE_KEY, JSON.stringify(fields));
  } catch {
    // ignore
  }
}

export const SEGUROS_QUOTE_FORM_DEFAULTS: SegurosQuoteFormValues = {
  vehicleType: "",
  plate: "",
  model: "",
  vehicleUse: "",
  garage: "",
  name: "",
  cpfCnpj: "",
  email: "",
  phone: "",
  cep: "",
};

export type SegurosQuoteFieldErrors = Partial<Record<keyof SegurosQuoteFormValues, string>>;

export function maskPlate(value: string): string {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 7);
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
}

function isValidCpf(digits: string): boolean {
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(digits[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(digits[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === Number(digits[10]);
}

function isValidCnpj(digits: string): boolean {
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;

  const calc = (length: number) => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < weights.length; i += 1) {
      sum += Number(digits[i]) * weights[i];
    }
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const d1 = calc(12);
  const d2 = calc(13);
  return d1 === Number(digits[12]) && d2 === Number(digits[13]);
}

export function validateQuoteStep(
  step: 1 | 2,
  values: SegurosQuoteFormValues
): SegurosQuoteFieldErrors {
  const errors: SegurosQuoteFieldErrors = {};

  if (step === 1) {
    if (!values.name.trim()) errors.name = "Por favor, informe seu nome.";
    if (values.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Informe um telefone válido.";
    }
    if (!values.vehicleType) errors.vehicleType = "Selecione o tipo de veículo.";
    if (values.plate.replace(/\W/g, "").length < 7) errors.plate = "Informe a placa.";
    if (!values.model.trim()) errors.model = "Informe marca e modelo.";
    if (!values.vehicleUse) errors.vehicleUse = "Selecione uma opção.";
    if (!values.garage) errors.garage = "Selecione uma opção.";
  }

  if (step === 2) {
    if (!values.name.trim()) errors.name = "Por favor, informe seu nome.";
    const docDigits = values.cpfCnpj.replace(/\D/g, "");
    if (docDigits.length === 11) {
      if (!isValidCpf(docDigits)) errors.cpfCnpj = "Informe um CPF válido.";
    } else if (docDigits.length === 14) {
      if (!isValidCnpj(docDigits)) errors.cpfCnpj = "Informe um CNPJ válido.";
    } else {
      errors.cpfCnpj = "Informe um CPF válido.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Informe um e-mail válido.";
    }
    if (values.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Informe um telefone válido.";
    }
    if (values.cep.replace(/\D/g, "").length !== 8) {
      errors.cep = "Informe um CEP válido.";
    }
  }

  return errors;
}

export function buildSegurosWhatsAppUrl(
  values: SegurosQuoteFormValues,
  baseUrl: string
): string {
  const message = [
    "Olá! Acessei o site *Seguro iGreen* e gostaria de receber uma cotação.",
    "",
    "*Veículo*",
    `Tipo: ${values.vehicleType}`,
    `Placa: ${values.plate}`,
    `Marca/Modelo: ${values.model}`,
    `Aplicativo ou Táxi: ${values.vehicleUse}`,
    `Garagem própria para pernoite: ${values.garage}`,
    "",
    "*Meus dados*",
    `Nome: ${values.name}`,
    `CPF/CNPJ: ${values.cpfCnpj}`,
    `E-mail: ${values.email}`,
    `WhatsApp: ${values.phone}`,
    `CEP: ${values.cep}`,
  ].join("\n");

  const url = new URL(baseUrl);
  url.searchParams.set("text", message);
  return url.toString();
}
