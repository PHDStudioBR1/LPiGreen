import { cleanString, onlyDigits } from "@/lib/crm/phd-crm-client";
import type { RandomServiceRepresentative } from "@/lib/random-service/client";
import { isEmailConfigured } from "./config";
import { sendMail } from "./send";

export type NotificationSegment = "seguros" | "telecom";

type SegurosFormValues = {
  vehicleType?: string;
  plate?: string;
  model?: string;
  vehicleUse?: string;
  garage?: string;
  name?: string;
  cpfCnpj?: string;
  email?: string;
  phone?: string;
  cep?: string;
};

type TelecomFormValues = {
  activationType?: string;
  cpfCnpj?: string;
  chipType?: string;
  portNumber?: string;
  currentOperator?: string;
  ddd?: string;
  selectedPlan?: string;
};

export type NotifyRepresentativeParams = {
  segmento: NotificationSegment;
  representative: RandomServiceRepresentative;
  leadId: number;
  crmEnv: string;
  formValues?: SegurosFormValues | TelecomFormValues;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPhone(phone: string): string {
  const digits = onlyDigits(phone);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone || "-";
}

function segmentLabel(segmento: NotificationSegment): string {
  return segmento === "seguros" ? "Seguros" : "Telecom";
}

function buildSegurosContent(values: SegurosFormValues) {
  const name = cleanString(values.name) || "-";
  const phone = formatPhone(cleanString(values.phone));
  const email = cleanString(values.email) || "-";
  const cpfCnpj = cleanString(values.cpfCnpj) || "-";
  const cep = cleanString(values.cep) || "-";

  const lines = [
    `Nome: ${name}`,
    `Telefone: ${phone}`,
    `E-mail: ${email}`,
    `CPF/CNPJ: ${cpfCnpj}`,
    `CEP: ${cep}`,
    `Tipo de veículo: ${cleanString(values.vehicleType) || "-"}`,
    `Placa: ${cleanString(values.plate) || "-"}`,
    `Modelo: ${cleanString(values.model) || "-"}`,
    `Uso: ${cleanString(values.vehicleUse) || "-"}`,
    `Garagem: ${cleanString(values.garage) || "-"}`,
  ];

  return { subjectLead: name, lines };
}

function buildTelecomContent(values: TelecomFormValues) {
  const cpfCnpj = cleanString(values.cpfCnpj) || "-";
  const phone = formatPhone(cleanString(values.portNumber) || cleanString(values.ddd));
  const activation =
    cleanString(values.activationType) === "portabilidade" ? "Portabilidade" : "Linha Nova";

  const lines = [
    `CPF/CNPJ: ${cpfCnpj}`,
    `Telefone: ${phone}`,
    `Tipo de ativação: ${activation}`,
    `Plano: ${cleanString(values.selectedPlan) || "-"}`,
    `Chip: ${cleanString(values.chipType) || "-"}`,
    `Operadora atual: ${cleanString(values.currentOperator) || "-"}`,
    `DDD: ${cleanString(values.ddd) || "-"}`,
    `Número a portar: ${cleanString(values.portNumber) || "-"}`,
  ];

  return { subjectLead: cpfCnpj, lines };
}

export async function notifyRepresentativeOfNewLead(
  params: NotifyRepresentativeParams
): Promise<void> {
  if (!isEmailConfigured()) return;

  const repEmail = params.representative.email?.trim().toLowerCase() ?? "";
  if (!repEmail || !isValidEmail(repEmail)) {
    console.warn(
      `Email rep (${params.segmento}): representante sem e-mail válido (${params.representative.name})`
    );
    return;
  }

  const segment = segmentLabel(params.segmento);
  const values = params.formValues ?? {};
  const content =
    params.segmento === "seguros"
      ? buildSegurosContent(values as SegurosFormValues)
      : buildTelecomContent(values as TelecomFormValues);

  const headerLines = [
    `Olá, ${params.representative.name || "representante"}!`,
    "",
    `Um novo lead de ${segment} foi finalizado no site e atribuído a você.`,
    "",
    `Lead CRM #${params.leadId} (ambiente: ${params.crmEnv})`,
    "",
    "--- Dados do lead ---",
    ...content.lines,
    "",
    "Acesse o PHD CRM para dar continuidade ao atendimento.",
  ];

  const text = headerLines.join("\n");
  const html = `
    <p>Olá, <strong>${escapeHtml(params.representative.name || "representante")}</strong>!</p>
    <p>Um novo lead de <strong>${escapeHtml(segment)}</strong> foi finalizado no site e atribuído a você.</p>
    <p><strong>Lead CRM #${params.leadId}</strong> (ambiente: ${escapeHtml(params.crmEnv)})</p>
    <h3>Dados do lead</h3>
    <ul>
      ${content.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
    </ul>
    <p>Acesse o PHD CRM para dar continuidade ao atendimento.</p>
  `.trim();

  await sendMail({
    to: repEmail,
    subject: `Novo lead ${segment} — ${content.subjectLead}`,
    text,
    html,
  });
}
