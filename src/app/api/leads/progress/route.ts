import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.LEAD_API_URL || "http://api-service";
const API_KEY = process.env.LEAD_API_KEY || process.env.API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (API_KEY) headers["X-API-Key"] = API_KEY;

    const url = `${BACKEND_URL.replace(/\/$/, "")}/api/leads/progress`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({
      error: "Erro ao processar resposta",
    }));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy /api/leads/progress POST error:", err);
    return NextResponse.json(
      { error: "Erro interno ao enviar solicitação" },
      { status: 500 }
    );
  }
}
