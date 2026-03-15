import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

export async function GET() {
  try {
    const res = await backendFetch('/api/representantes', { method: 'GET' });
    const data = await res.json().catch(() => ({ error: 'Erro ao processar resposta' }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Proxy GET /api/representantes error:', err);
    return NextResponse.json(
      { error: 'Erro interno ao listar representantes' },
      { status: 500 }
    );
  }
}
