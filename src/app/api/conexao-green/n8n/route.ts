import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL?.trim() ?? "";

/**
 * Encaminha o lead do funil Conexão Green para o webhook do n8n (URL só no servidor).
 * O browser chama esta rota; não expõe o endpoint do n8n nem depende de CORS no n8n.
 */
export async function POST(request: NextRequest) {
  if (!N8N_WEBHOOK_URL) {
    return NextResponse.json(
      {
        error:
          "N8N_WEBHOOK_URL não está definida no servidor Next. Configure o Secret ou a variável de ambiente.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const nome = (body as Record<string, unknown>).nome;
  if (typeof nome !== "string" || nome.trim().length < 2) {
    return NextResponse.json({ error: "Campo nome é obrigatório" }, { status: 400 });
  }

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json") && text) {
      try {
        return NextResponse.json(JSON.parse(text), { status: res.status });
      } catch {
        return new NextResponse(text, { status: res.status });
      }
    }
    return new NextResponse(text || null, { status: res.status });
  } catch (err) {
    console.error("POST /api/conexao-green/n8n → n8n:", err);
    return NextResponse.json(
      { error: "Falha ao contactar o webhook n8n" },
      { status: 502 }
    );
  }
}
