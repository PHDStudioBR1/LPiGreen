import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.LEAD_API_URL || "http://api-service";
const API_KEY = process.env.LEAD_API_KEY || process.env.API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: ArrayBuffer | string;
    if (contentType.includes("multipart/form-data")) {
      body = await request.arrayBuffer();
    } else {
      body = await request.text();
    }

    const headers: HeadersInit = {
      "Content-Type": contentType,
    };
    if (API_KEY) headers["X-API-Key"] = API_KEY;

    const url = `${BACKEND_URL.replace(/\/$/, "")}/api/leads`;
    const res = await fetch(url, {
      method: "POST",
      body: body instanceof ArrayBuffer ? body : (typeof body === "string" ? body : undefined),
      headers,
    });

    const data = await res.json().catch(() => ({ error: "Erro ao processar resposta" }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy /api/leads error:", err);
    return NextResponse.json(
      { error: "Erro interno ao enviar solicitação" },
      { status: 500 }
    );
  }
}
