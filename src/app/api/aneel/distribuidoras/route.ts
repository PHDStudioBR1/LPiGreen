import { NextResponse } from "next/server";

const ANEEL_DISTRIBUIDORAS_URL =
  "https://dadosabertos.aneel.gov.br/api/3/action/datastore_search_sql?sql=SELECT%20%22SigAgente%22%2C%20%22NumCNPJDistribuidora%22%2C%20%22DscBaseTarifaria%22%20FROM%20%22fcf2906c-7c32-4b9b-a637-054e7a5234f4%22%20GROUP%20BY%20%22SigAgente%22%2C%20%22NumCNPJDistribuidora%22%2C%20%22DscBaseTarifaria%22%20LIMIT%201000";

const FALLBACK_DISTRIBUIDORAS = [
  "AME",
  "BOA VISTA",
  "CEA",
  "CEEE-D",
  "CELESC",
  "CEMIG-D",
  "CEMIRIM",
  "CERFOX",
  "CERGAL",
  "CERILUZ",
  "CERMC",
  "CERMISSÕES",
  "CERTAJA",
  "CERTEL ENERGIA",
  "CERR",
  "CFLO",
  "CHESP",
  "COCEL",
  "COELBA",
  "COPEL-DIS",
  "COPREL",
  "COSERN",
  "CPFL JAGUARI",
  "CPFL LESTE PAULI",
  "CPFL MOCOCA",
  "CPFL SANTA CRUZ",
  "CPFL SUL PAULIST",
  "CPFL-PAULISTA",
  "CPFL-PIRATININGA",
  "DCELT",
  "DEMEI",
  "DMED",
  "EAC",
  "EBO",
  "EDEVP",
  "EDP ES",
  "EDP SP",
  "EEB",
  "EFLJC",
  "EFLUL",
  "ELEKTRO",
  "ELETROCAR",
  "EMR",
  "EMS",
  "ENEL CE",
  "ENEL RJ",
  "ENF",
  "EQUATORIAL AL",
  "EQUATORIAL GO",
  "EQUATORIAL MA",
  "EQUATORIAL PA",
  "EQUATORIAL PI",
  "ERO",
  "ESS",
  "ETO",
  "LIGHT SESA",
  "Neoenergia Brasília",
  "Neoenergia PE",
  "RGE",
  "RGE SUL",
  "SULGIPE",
];

function fallbackResponse() {
  return {
    success: true,
    fromCache: true,
    result: {
      records: FALLBACK_DISTRIBUIDORAS.map((nome) => ({
        SigAgente: nome,
        NumCNPJDistribuidora: "",
        DscBaseTarifaria: "",
      })),
      fields: [
        { id: "SigAgente", type: "text" },
        { id: "NumCNPJDistribuidora", type: "text" },
        { id: "DscBaseTarifaria", type: "text" },
      ],
    },
  };
}

export async function GET() {
  try {
    const response = await fetch(ANEEL_DISTRIBUIDORAS_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("Erro ao consultar ANEEL:", response.status, text);
      return NextResponse.json(fallbackResponse());
    }

    const data = await response.json().catch(() => null);
    if (!data) {
      return NextResponse.json(fallbackResponse());
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro interno /api/aneel/distribuidoras:", error);
    return NextResponse.json(fallbackResponse());
  }
}
