import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAndNormalizeModelResponse } from '../src/document-validation/document-validation-service.js';

test('parseAndNormalizeModelResponse aceita JSON válido e mantém documentos', () => {
  const raw = JSON.stringify({
    documentos: [
      {
        slot: 'document_front',
        tipo_detectado: 'rg_frente',
        legivel: true,
        documento_esperado: true,
        confianca: 0.9,
        problemas_encontrados: [],
      },
    ],
    status_final: 'aprovado',
    faltantes: [],
    conflitos_duplicados: [],
    recomendacao: 'aprovar',
  });

  const result = parseAndNormalizeModelResponse(raw, ['document_front', 'energy_bill']);

  assert.equal(result.status_final, 'aprovado');
  assert.equal(result.documentos.length, 2);

  const energyBill = result.documentos.find((d) => d.slot === 'energy_bill');
  assert.ok(energyBill, 'deve criar documento para energy_bill ausente');
  assert.equal(energyBill.confianca, 0);
});

test('parseAndNormalizeModelResponse lança erro em JSON inválido', () => {
  assert.throws(
    () => parseAndNormalizeModelResponse('{"status_final": "aprovado"'),
    /JSON válido/,
  );
});

