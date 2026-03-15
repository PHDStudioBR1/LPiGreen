import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID do lead é obrigatório' }, { status: 400 });
    }
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const path = `/api/leads/${encodeURIComponent(id)}/logs${query ? `?${query}` : ''}`;
    const res = await backendFetch(path, { method: 'GET' });
    const data = await res.json().catch(() => ({ error: 'Erro ao processar resposta' }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Proxy GET /api/leads/[id]/logs error:', err);
    return NextResponse.json(
      { error: 'Erro interno ao listar logs do lead' },
      { status: 500 }
    );
  }
}
