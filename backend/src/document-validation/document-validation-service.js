import { z } from 'zod';
import { config } from '../config.js';
import { callOpenAI } from './providers/openai-provider.js';
import { callDeepSeek } from './providers/deepseek-provider.js';

// ---------- Schemas ----------

const documentAnalysisSchema = z.object({
  slot: z.string(),
  tipo_detectado: z.string().nullable(),
  legivel: z.boolean().nullable(),
  documento_esperado: z.boolean().nullable(),
  confianca: z.number().min(0).max(1),
  problemas_encontrados: z.array(z.string()).default([]),
});

const validationResultSchema = z.object({
  documentos: z.array(documentAnalysisSchema),
  status_final: z.enum(['aprovado', 'reprovado', 'necessita_revisao_manual']),
  faltantes: z.array(z.string()),
  conflitos_duplicados: z.array(z.string()).default([]),
  recomendacao: z.enum(['aprovar', 'solicitar_reenvio', 'revisao_manual']),
});

export { documentAnalysisSchema, validationResultSchema };

// ---------- Parser / normalizador ----------

export function parseAndNormalizeModelResponse(raw, knownSlots = []) {
  let json;

  if (typeof raw === 'string') {
    try {
      json = JSON.parse(raw);
    } catch (err) {
      throw new Error('Resposta da LLM não é um JSON válido');
    }
  } else if (raw && typeof raw === 'object') {
    json = raw;
  } else {
    throw new Error('Resposta vazia da LLM');
  }

  const parsed = validationResultSchema.parse(json);

  // Garante que todos os slots conhecidos existam na lista de documentos
  const existingSlots = new Set(parsed.documentos.map((d) => d.slot));
  const documentos = [...parsed.documentos];

  for (const slot of knownSlots) {
    if (!existingSlots.has(slot)) {
      documentos.push({
        slot,
        tipo_detectado: null,
        legivel: null,
        documento_esperado: null,
        confianca: 0,
        problemas_encontrados: ['documento não analisado automaticamente'],
      });
    }
  }

  return {
    ...parsed,
    documentos,
  };
}

// ---------- Serviço principal ----------

function getProviderConfig() {
  const docAi = config.docAi || {};
  const provider = String(docAi.provider || '').trim().toLowerCase();
  const timeoutMs = Number.isFinite(docAi.timeoutMs) ? docAi.timeoutMs : 8000;

  return {
    provider,
    timeoutMs,
    openai: {
      apiKey: docAi.openai?.apiKey || process.env.OPENAI_API_KEY || '',
      model: docAi.openai?.model || process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    },
    deepseek: {
      apiKey: docAi.deepseek?.apiKey || process.env.DEEPSEEK_API_KEY || '',
      model: docAi.deepseek?.model || process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    },
  };
}

export class DocumentValidationService {
  constructor() {
    this.config = getProviderConfig();
  }

  isEnabled() {
    const { provider, openai, deepseek } = this.config;
    if (provider === 'openai') return !!openai.apiKey;
    if (provider === 'deepseek') return !!deepseek.apiKey;
    return false;
  }

  buildPrompt({ documentos, formContext }) {
    const entrada = {
      documentos: documentos.map((d) => ({
        slot: d.slot,
        label: d.label,
        tipo_esperado: d.tipo_esperado,
        mimetype: d.mimetype || null,
        tamanho_bytes: d.size_bytes ?? null,
        ocr_text_preview: d.ocr_text ? String(d.ocr_text).slice(0, 4000) : null,
        metadata: d.metadata || null,
      })),
      formulario: {
        document_type: formContext.document_type || null,
        power_company: formContext.power_company || null,
        installation_number: formContext.installation_number || null,
        has_pending_debts: formContext.has_pending_debts ?? null,
      },
    };

    const jsonExemplo = {
      documentos: [
        {
          slot: 'document_front',
          tipo_detectado: 'rg_frente',
          legivel: true,
          documento_esperado: true,
          confianca: 0.95,
          problemas_encontrados: ['exemplo de problema, se houver'],
        },
        {
          slot: 'energy_bill',
          tipo_detectado: 'conta_de_luz',
          legivel: true,
          documento_esperado: true,
          confianca: 0.92,
          problemas_encontrados: [],
        },
      ],
      status_final: 'aprovado',
      faltantes: [],
      conflitos_duplicados: [],
      recomendacao: 'aprovar',
    };

    return [
      'Você é um sistema de validação de documentos para onboarding de clientes de energia.',
      'Analise os documentos enviados e responda ESTRITAMENTE em JSON válido, sem comentários e sem texto extra.',
      '',
      'Regras de negócio principais:',
      '- Tipos esperados: RG (frente/verso) ou CNH; e conta de luz recente (até 90 dias, quando possível inferir).',
      '- Considere os slots: "document_front", "document_back", "energy_bill".',
      '- Para cada documento, preencha: tipo_detectado, legivel (true/false ou null se não conseguir avaliar), documento_esperado (true/false ou null), confianca (0 a 1) e problemas_encontrados (lista de strings).',
      '- status_final deve ser um de: "aprovado", "reprovado", "necessita_revisao_manual".',
      '- recomendacao deve ser um de: "aprovar", "solicitar_reenvio", "revisao_manual".',
      '- Quando não houver dados suficientes (por exemplo, sem texto OCR ou metadados claros), use status_final = "necessita_revisao_manual" e recomendacao = "revisao_manual".',
      '',
      'Formato EXATO de saída (exemplo, adapte os valores):',
      JSON.stringify(jsonExemplo, null, 2),
      '',
      'Agora, considere a seguinte entrada em JSON:',
      JSON.stringify(entrada, null, 2),
      '',
      'Responda apenas com o JSON final, sem qualquer explicação adicional.',
    ].join('\n');
  }

  buildRetryPrompt(originalPrompt) {
    return [
      'A resposta anterior não estava em JSON estrito ou não seguiu o schema esperado.',
      'Por favor, responda novamente, seguindo EXATAMENTE o formato de saída descrito.',
      '',
      originalPrompt,
    ].join('\n');
  }

  buildManualReviewFallback(documentos) {
    return {
      documentos: documentos.map((d) => ({
        slot: d.slot,
        tipo_detectado: null,
        legivel: null,
        documento_esperado: null,
        confianca: 0,
        problemas_encontrados: ['Validação automática indisponível. Necessário revisão manual.'],
      })),
      status_final: 'necessita_revisao_manual',
      faltantes: [],
      conflitos_duplicados: [],
      recomendacao: 'revisao_manual',
    };
  }

  async callProvider(prompt) {
    const { provider, timeoutMs, openai, deepseek } = this.config;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      if (provider === 'openai') {
        return await callOpenAI({
          prompt,
          model: openai.model,
          apiKey: openai.apiKey,
          signal: controller.signal,
        });
      }
      if (provider === 'deepseek') {
        return await callDeepSeek({
          prompt,
          model: deepseek.model,
          apiKey: deepseek.apiKey,
          signal: controller.signal,
        });
      }

      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  async validateDocuments({ documentos, formContext }) {
    const knownSlots = documentos.map((d) => d.slot);

    if (!this.isEnabled() || knownSlots.length === 0) {
      return this.buildManualReviewFallback(documentos);
    }

    const basePrompt = this.buildPrompt({ documentos, formContext });

    try {
      const firstRaw = await this.callProvider(basePrompt);
      if (!firstRaw) {
        console.error('Document validation: provider não retornou conteúdo');
        return this.buildManualReviewFallback(documentos);
      }

      try {
        return parseAndNormalizeModelResponse(firstRaw, knownSlots);
      } catch (err) {
        console.error('Document validation: erro ao parsear primeira resposta da LLM:', err.message);
      }

      // Retry único com prompt reforçado
      const retryPrompt = this.buildRetryPrompt(basePrompt);
      const secondRaw = await this.callProvider(retryPrompt);
      if (!secondRaw) {
        console.error('Document validation: provider não retornou conteúdo no retry');
        return this.buildManualReviewFallback(documentos);
      }

      try {
        return parseAndNormalizeModelResponse(secondRaw, knownSlots);
      } catch (err) {
        console.error('Document validation: erro ao parsear resposta de retry da LLM:', err.message);
        return this.buildManualReviewFallback(documentos);
      }
    } catch (error) {
      console.error('Document validation: erro ao chamar provider de IA:', error.message);
      return this.buildManualReviewFallback(documentos);
    }
  }
}

