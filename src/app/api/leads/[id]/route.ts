import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID do lead é obrigatório' }, { status: 400 });
    }
    const res = await backendFetch(`/api/leads/${encodeURIComponent(id)}`, { method: 'GET' });
    const data = await res.json().catch(() => ({ error: 'Erro ao processar resposta' }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Proxy GET /api/leads/[id] error:', err);
    return NextResponse.json(
      { error: 'Erro interno ao buscar lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID do lead é obrigatório' }, { status: 400 });
    }
    const body = await request.json().catch(() => ({}));
    const res = await backendFetch(`/api/leads/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({ error: 'Erro ao processar resposta' }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Proxy PATCH /api/leads/[id] error:', err);
    return NextResponse.json(
      { error: 'Erro interno ao atualizar lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID do lead é obrigatório' }, { status: 400 });
    }
    const res = await backendFetch(`/api/leads/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({ error: 'Erro ao processar resposta' }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Proxy DELETE /api/leads/[id] error:', err);
    return NextResponse.json(
      { error: 'Erro interno ao remover lead' },
      { status: 500 }
    );
  }
}
