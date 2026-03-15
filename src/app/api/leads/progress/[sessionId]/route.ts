import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.LEAD_API_URL || "http://api-service";
const API_KEY = process.env.LEAD_API_KEY || process.env.API_KEY || "";

type Params = {
  params: Promise<{ sessionId: string }>;
};

function buildTargetUrl(sessionId: string) {
  return `${BACKEND_URL.replace(/\/$/, "")}/api/leads/progress/${encodeURIComponent(sessionId)}`;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { sessionId } = await params;
    const headers: HeadersInit = {};
    if (API_KEY) headers["X-API-Key"] = API_KEY;

    const url = buildTargetUrl(sessionId);
    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({
      error: "Erro ao processar resposta",
    }));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy /api/leads/progress/:sessionId GET error:", err);
    return NextResponse.json(
      { error: "Erro interno ao enviar solicitação" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { sessionId } = await params;
    const headers: HeadersInit = {};
    if (API_KEY) headers["X-API-Key"] = API_KEY;

    const url = buildTargetUrl(sessionId);
    const res = await fetch(url, {
      method: "DELETE",
      headers,
    });

    const data = await res.json().catch(() => ({
      error: "Erro ao processar resposta",
    }));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy /api/leads/progress/:sessionId DELETE error:", err);
    return NextResponse.json(
      { error: "Erro interno ao enviar solicitação" },
      { status: 500 }
    );
  }
}
