import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const path = `/api/config${query ? `?${query}` : ''}`;
    const res = await backendFetch(path, { method: 'GET' });
    const data = await res
      .json()
      .catch(() => ({ error: 'Erro ao processar resposta' }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Proxy GET /api/admin/config error:', err);
    return NextResponse.json(
      { error: 'Erro interno ao consultar configuração' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await backendFetch('/api/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res
      .json()
      .catch(() => ({ error: 'Erro ao processar resposta' }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Proxy PATCH /api/admin/config error:', err);
    return NextResponse.json(
      { error: 'Erro interno ao atualizar configuração' },
      { status: 500 },
    );
  }
}
