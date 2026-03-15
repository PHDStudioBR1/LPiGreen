import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-api';

const EXPORT_LIMIT = 10000;

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams(searchParams);
  params.set('limit', String(EXPORT_LIMIT));
  params.set('offset', '0');

  const query = params.toString();
  const path = `/api/leads${query ? `?${query}` : ''}`;
  const res = await backendFetch(path, { method: 'GET' });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      data.error ? data : { error: 'Erro ao buscar leads para exportação' },
      { status: res.status }
    );
  }

  const rows = (await res.json()) as Record<string, unknown>[];
  const excludeKeys = [
    'document_front_base64',
    'document_back_base64',
    'energy_bill_base64',
    'payment_proof_base64',
  ];
  const headers = rows.length
    ? (Object.keys(rows[0]).filter((k) => !excludeKeys.includes(k)) as string[])
    : [
        'id',
        'name',
        'document_number',
        'email',
        'phone',
        'status',
        'eligibility_status',
        'representante_id',
        'created_at',
      ];

  const csvLines: string[] = [headers.map(escapeCsvCell).join(',')];
  for (const row of rows) {
    const cells = headers.map((h) => escapeCsvCell((row as Record<string, unknown>)[h]));
    csvLines.push(cells.join(','));
  }
  const csv = '\uFEFF' + csvLines.join('\r\n'); // BOM for Excel UTF-8

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="leads.csv"',
    },
  });
}
