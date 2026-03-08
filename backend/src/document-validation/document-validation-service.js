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

/** Confiança mínima para considerar documento aprovado (0 a 1). */
const MIN_CONFIANCA_APROVADO = 0.75;

/**
 * Aplica regras rígidas: a IA pode ser permissiva demais. Só aceitamos "aprovado"
 * se TODOS os documentos tiverem legivel=true, documento_esperado=true e confiança mínima.
 * Qualquer falha ou incerteza → reprovado ou revisão manual.
 */
function applyStrictValidation(result) {
  const { documentos } = result;
  let statusFinal = result.status_final;
  let recomendacao = result.recomendacao;

  const algumReprovado = documentos.some(
    (d) => d.legivel === false || d.documento_esperado === false
  );
  const algumIncerteza = documentos.some(
    (d) => d.legivel === null || d.documento_esperado === null
  );
  const algumaConfiancaBaixa = documentos.some(
    (d) => typeof d.confianca === 'number' && d.confianca < MIN_CONFIANCA_APROVADO
  );
  const todosAprovadosPelaIA = documentos.every(
    (d) => d.legivel === true && d.documento_esperado === true
  );

  if (algumReprovado) {
    statusFinal = 'reprovado';
    recomendacao = 'solicitar_reenvio';
  } else if (algumIncerteza || algumaConfiancaBaixa || !todosAprovadosPelaIA) {
    // Em dúvida ou confiança baixa: não aprovar automaticamente
    if (statusFinal === 'aprovado') {
      statusFinal = 'necessita_revisao_manual';
      recomendacao = 'revisao_manual';
    }
  }

  return {
    ...result,
    status_final: statusFinal,
    recomendacao,
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
      'Você é um validador RIGOROSO de documentos. Seja ESTRITO: em dúvida, reprove ou marque para revisão. Não aprove documentos que não sejam claramente o esperado.',
      'Analise as imagens e responda ESTRITAMENTE em JSON válido, sem comentários e sem texto extra.',
      '',
      'REGRAS OBRIGATÓRIAS (seja conservador):',
      '1) document_front: SÓ documento_esperado=true se a imagem for CLARAMENTE a frente de RG ou da CNH. Se for outra coisa (carteira, selfie, outro documento, imagem genérica), documento_esperado=false. legivel=true SÓ se der para ler nome, número e dados principais.',
      '2) document_back: SÓ documento_esperado=true se for CLARAMENTE o verso do RG. Se o usuário escolheu CNH no formulário, o verso pode não existir; avalie conforme o tipo. Se a imagem não for verso de RG, documento_esperado=false.',
      '3) energy_bill: SÓ documento_esperado=true se for CLARAMENTE uma conta de luz/energia (nome da distribuidora, valor, consumo). Qualquer outro documento (água, gás, boleto genérico) = documento_esperado=false. legivel=true SÓ se a conta estiver legível e completa (não cortada).',
      '4) Correspondência: compare nome e número do documento (CPF/RG) visíveis na imagem com name e document_number do formulário. Se não conseguir conferir ou os dados não baterem, documento_esperado=false e coloque em problemas_encontrados.',
      '5) Legibilidade: legivel=false se estiver borrado, escuro, cortado, de lado, ou ilegível. Em dúvida, use legivel=false. confianca: use valores baixos (ex: 0.5) quando não tiver certeza.',
      '6) status_final: use "aprovado" SOMENTE quando TODOS os documentos estiverem corretos, legíveis e batendo com o formulário. Se qualquer um falhar ou houver dúvida, use "reprovado" ou "necessita_revisao_manual". recomendacao: "solicitar_reenvio" quando algo estiver errado; "revisao_manual" quando não conseguir avaliar (ex.: PDF).',
      '7) Se a imagem não corresponder ao slot (ex.: na imagem 1 veio conta de luz em vez de documento), documento_esperado=false e descreva em problemas_encontrados.',
      '',
      'Slots: document_front, document_back, energy_bill. Para cada um: tipo_detectado, legivel (true/false/null), documento_esperado (true/false/null), confianca (0 a 1), problemas_encontrados (array de strings).',
      'status_final: "aprovado" | "reprovado" | "necessita_revisao_manual". recomendacao: "aprovar" | "solicitar_reenvio" | "revisao_manual".',
      'Seja RIGOROSO: na dúvida, reprove ou marque revisão. Não aprove fotos de coisas que não sejam o documento esperado.',
      '',
      'Formato EXATO de saída:',
      JSON.stringify(jsonExemplo, null, 2),
      imageHint,
      '',
      'Entrada (formulário e metadados):',
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
        const parsed = parseAndNormalizeModelResponse(firstRaw, knownSlots);
        const result = applyStrictValidation(parsed);
        console.info(`Document validation: sucesso. status_final=${result.status_final} (strict applied)`);
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
        const parsed = parseAndNormalizeModelResponse(secondRaw, knownSlots);
        const result = applyStrictValidation(parsed);
        console.info(`Document validation: sucesso no retry. status_final=${result.status_final} (strict applied)`);
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

