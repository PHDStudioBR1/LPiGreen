export type RandomServiceRepresentative = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  autoconnection_link?: string | null;
  link_seguros?: string | null;
  link_telecom?: string | null;
  license_link?: string | null;
  evolution_whats?: string | null;
};

function nonEmptyLink(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getRepresentativeLinkForSegment(
  representative: RandomServiceRepresentative,
  segmento: RandomServiceSegment
): string | null {
  switch (segmento) {
    case "bot":
      return nonEmptyLink(representative.autoconnection_link);
    case "seguros":
      return nonEmptyLink(representative.link_seguros);
    case "telecom":
      return nonEmptyLink(representative.link_telecom);
    default:
      return null;
  }
}

export type RandomServiceAssignment = {
  id: string;
  lead_name: string;
  lead_phone: string;
  approved: boolean;
  assigned_at: string;
};

export type RandomServiceNextResponse = {
  representative?: RandomServiceRepresentative;
  assignment?: RandomServiceAssignment;
};

export type RandomServiceSegment = "bot" | "seguros" | "telecom";

function getRandomServiceBaseUrl(): string {
  const raw = (process.env.RANDOM_SERVICE_URL ?? "http://random-service-api:3000").replace(/\/$/, "");
  if (/^https?:\/\/[^/:]+$/i.test(raw)) {
    return `${raw}:3000`;
  }
  return raw;
}

export async function fetchNextRepresentative(params: {
  nome_lead: string;
  telefone: string;
  segmento: RandomServiceSegment;
}): Promise<RandomServiceNextResponse> {
  const res = await fetch(`${getRandomServiceBaseUrl()}/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome_lead: params.nome_lead,
      telefone: params.telefone,
      segmento: params.segmento,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`random-service /next HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`);
  }

  const body = (await res.json()) as RandomServiceNextResponse;
  if (!body.representative) {
    throw new Error("random-service: representative ausente na resposta");
  }

  return body;
}

export async function approveSegmentRotation(segmento: RandomServiceSegment): Promise<void> {
  const res = await fetch(`${getRandomServiceBaseUrl()}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ segmento }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`random-service /approve HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`);
  }
}

export async function assignRepresentativeToLead(params: {
  segmento: RandomServiceSegment;
  leadName: string;
  leadPhone: string;
  assignResponsavel: (representative: RandomServiceRepresentative) => Promise<number | null>;
}): Promise<{
  representative: RandomServiceRepresentative;
  responsavelId: number | null;
  rotationApproved: boolean;
}> {
  const body = await fetchNextRepresentative({
    nome_lead: params.leadName,
    telefone: params.leadPhone,
    segmento: params.segmento,
  });
  const representative = body.representative;
  if (!representative) {
    throw new Error("random-service: representative ausente na resposta");
  }

  const responsavelId = await params.assignResponsavel(representative);

  await approveSegmentRotation(params.segmento);

  return { representative, responsavelId, rotationApproved: true };
}
