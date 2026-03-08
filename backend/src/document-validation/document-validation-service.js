import { z } from 'zod';
import { config } from '../config.js';
import { callOpenAI, callOpenAIVision } from './providers/openai-provider.js';
import { callDeepSeek } from './providers/deepseek-provider.js';

const IMAGE_MIMETYPE_PREFIX = 'image/';

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
      modelVision: docAi.openai?.modelVision || process.env.OPENAI_VISION_MODEL || 'gpt-4o',
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

  buildPrompt({ documentos, formContext, imageOrder }) {
    const entrada = {
      documentos: documentos.map((d) => ({
        slot: d.slot,
        label: d.label,
        tipo_esperado: d.tipo_esperado,
        mimetype: d.mimetype || null,
        tamanho_bytes: d.size_bytes ?? null,
        tem_imagem_anexada: !!(d.content_base64 && String(d.mimetype || '').startsWith(IMAGE_MIMETYPE_PREFIX)),
        ocr_text_preview: d.ocr_text ? String(d.ocr_text).slice(0, 4000) : null,
        metadata: d.metadata || null,
      })),
      formulario: {
        name: formContext.name || null,
        document_number: formContext.document_number || null,
        document_type: formContext.document_type || null,
        power_company: formContext.power_company || null,
        installation_number: formContext.installation_number || null,
        has_pending_debts: formContext.has_pending_debts ?? null,
      },
    };

    const jsonExemplo = {
      documentos: [
        { slot: 'document_front', tipo_detectado: 'rg_frente', legivel: true, documento_esperado: true, confianca: 0.95, problemas_encontrados: [] },
        { slot: 'document_back', tipo_detectado: 'rg_verso', legivel: true, documento_esperado: true, confianca: 0.95, problemas_encontrados: [] },
        { slot: 'energy_bill', tipo_detectado: 'conta_de_luz', legivel: true, documento_esperado: true, confianca: 0.92, problemas_encontrados: [] },
      ],
      status_final: 'aprovado',
      faltantes: [],
      conflitos_duplicados: [],
      recomendacao: 'aprovar',
    };

    let imageHint = '';
    if (imageOrder && imageOrder.length > 0) {
      imageHint = [
        '',
        'As imagens anexadas nesta mensagem correspondem, NA ORDEM, aos seguintes slots:',
        imageOrder.map((slot, i) => `  Imagem ${i + 1} = ${slot}`).join('\n'),
        'Analise cada imagem e preencha o documento do slot correspondente.',
      ].join('\n');
    }

    return [
      'Você é um sistema de validação de documentos para onboarding de clientes de energia.',
      'Analise os documentos (e as imagens quando anexadas) e responda ESTRITAMENTE em JSON válido, sem comentários e sem texto extra.',
      '',
      'Regras OBRIGATÓRIAS:',
      '1) document_front: deve ser a Frente do RG ou a CNH (frente). Verifique se é realmente a frente do documento e se está legível.',
      '2) document_back: deve ser o Verso do RG. Se o usuário informou CNH, o verso pode não existir; caso não haja imagem para document_back, use documento_esperado e legivel conforme o que tiver.',
      '3) energy_bill: deve ser a conta de luz (conta de energia). Verifique se está legível e se parece completo (não cortado).',
      '4) Correspondência com o formulário: compare nome e número do documento (CPF/RG) lidos nas imagens com os dados do formulário (name, document_number). Se não bater, indique em problemas_encontrados e documento_esperado=false.',
      '5) Legibilidade: para cada documento, legivel=true apenas se for possível ler claramente os dados; se estiver borrado, cortado ou ilegível, legivel=false.',
      '6) PDF: se um slot for PDF (tem_imagem_anexada=false e mimetype application/pdf), use status necessita_revisao_manual para esse documento e recomendacao revisao_manual (não é possível analisar PDF aqui).',
      '',
      'Slots: "document_front", "document_back", "energy_bill". Para cada um: tipo_detectado, legivel (true/false ou null), documento_esperado (true/false ou null), confianca (0 a 1), problemas_encontrados (lista de strings).',
      'status_final: "aprovado" | "reprovado" | "necessita_revisao_manual". recomendacao: "aprovar" | "solicitar_reenvio" | "revisao_manual".',
      'Reprovado quando: documento não corresponde ao esperado, ilegível, ou dados não batem com o formulário. Aprovado quando tudo estiver correto e legível.',
      '',
      'Formato EXATO de saída:',
      JSON.stringify(jsonExemplo, null, 2),
      imageHint,
      '',
      'Entrada (dados do formulário e metadados dos documentos):',
      JSON.stringify(entrada, null, 2),
      '',
      'Responda apenas com o JSON final, sem explicação.',
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

  buildVisionImages(documentos) {
    const images = [];
    const order = [];
    for (const d of documentos) {
      const base64 = d.content_base64;
      const mimetype = (d.mimetype || '').toLowerCase();
      if (base64 && mimetype.startsWith(IMAGE_MIMETYPE_PREFIX)) {
        images.push({ mimetype, base64 });
        order.push(d.slot);
      }
    }
    return { images, imageOrder: order };
  }

  async callProvider(prompt, options = {}) {
    const { provider, timeoutMs, openai, deepseek } = this.config;
    const { images = [] } = options;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      if (provider === 'openai' && images.length > 0) {
        return await callOpenAIVision({
          prompt,
          images,
          model: openai.modelVision,
          apiKey: openai.apiKey,
          signal: controller.signal,
        });
      }
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

    if (!this.isEnabled()) {
      console.warn(
        'Document validation: desabilitado. Defina DOC_AI_PROVIDER (openai|deepseek) e a API key correspondente (OPENAI_API_KEY ou DEEPSEEK_API_KEY).'
      );
      return this.buildManualReviewFallback(documentos);
    }

    if (knownSlots.length === 0) {
      console.warn('Document validation: nenhum documento para validar.');
      return this.buildManualReviewFallback(documentos);
    }

    const { images, imageOrder } = this.buildVisionImages(documentos);
    const useVision = this.config.provider === 'openai' && images.length > 0;
    console.info(
      `Document validation: provider="${this.config.provider}", ${knownSlots.length} documento(s), vision=${useVision} (${images.length} imagens).`
    );

    const basePrompt = this.buildPrompt({ documentos, formContext, imageOrder });

    try {
      const firstRaw = await this.callProvider(basePrompt, { images });
      if (!firstRaw) {
        console.error('Document validation: provider não retornou conteúdo');
        return this.buildManualReviewFallback(documentos);
      }

      try {
        const result = parseAndNormalizeModelResponse(firstRaw, knownSlots);
        console.info(`Document validation: sucesso. status_final=${result.status_final}`);
        return result;
      } catch (err) {
        console.error('Document validation: erro ao parsear primeira resposta da LLM:', err.message);
      }

      const retryPrompt = this.buildRetryPrompt(basePrompt);
      const secondRaw = await this.callProvider(retryPrompt, { images });
      if (!secondRaw) {
        console.error('Document validation: provider não retornou conteúdo no retry');
        return this.buildManualReviewFallback(documentos);
      }

      try {
        const result = parseAndNormalizeModelResponse(secondRaw, knownSlots);
        console.info(`Document validation: sucesso no retry. status_final=${result.status_final}`);
        return result;
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

