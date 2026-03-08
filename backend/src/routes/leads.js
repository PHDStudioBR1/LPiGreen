import { Router } from 'express';
import {
  insertLead,
  listLeads,
  listLeadsByEligibilityStatus,
  updateLeadEligibilityByDocument,
  getLeadById,
  updateLeadById,
  softDeleteLeadById,
} from '../leads-repository.js';
import { validateLead } from '../validation.js';
import { uploadFields } from '../middleware/upload.js';
import { saveLeadProgress, getLeadProgress, clearLeadProgress } from '../progress-cache.js';
import {
  insertLeadFormLog,
  listLeadFormLogs,
  listLeadFormLogsByLeadId,
  getLeadFormLogById,
  deleteLeadFormLogById,
} from '../lead-form-logs-repository.js';
import { documentValidationService } from '../document-validation/index.js';

const router = Router();
const CACHE_START_STEP_INDEX = 1;
const MAX_SESSION_ID_LENGTH = 64;

const ALLOWED_PROGRESS_FIELDS = [
  'cep_landing',
  'valor_conta',
  'document_number',
  'name',
  'birth_date',
  'phone',
  'phone_confirm',
  'email',
  'email_confirm',
  'cep',
  'address',
  'number',
  'neighborhood',
  'city',
  'state',
  'complement',
  'power_company',
  'installation_number',
  'discount_option',
  'document_type',
  'energy_bill_password',
  'has_pending_debts',
];

function sanitizeProgressValues(values) {
  const sanitized = {};
  if (!values || typeof values !== 'object') return sanitized;

  for (const key of ALLOWED_PROGRESS_FIELDS) {
    const value = values[key];
    if (value === undefined || value === null) continue;
    sanitized[key] = typeof value === 'string' ? value.trim().slice(0, 512) : value;
  }
  return sanitized;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim().slice(0, 64);
  }
  const ip = req.ip || req.socket?.remoteAddress || '';
  return String(ip).slice(0, 64);
}

async function registerLeadProgressLog(req, payload) {
  try {
    await insertLeadFormLog({
      ...payload,
      ipAddress: getClientIp(req),
      userAgent: (req.headers['user-agent'] || '').slice(0, 512),
    });
  } catch (error) {
    console.error('Lead form log error:', error.message);
  }
}

router.get('/', async (req, res) => {
  try {
    const {
      status,
      eligibility_status,
      representante_id,
      document_number,
      created_from,
      created_to,
      limit,
      offset,
    } = req.query;

    const leads = await listLeads({
      status,
      eligibility_status,
      representante_id,
      document_number,
      created_from,
      created_to,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    return res.status(200).json(leads);
  } catch (err) {
    console.error('List leads error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao listar leads' });
  }
});

router.post('/', uploadFields, async (req, res) => {
  try {
    const body = { ...req.body };
    const parsed = validateLead(body, req.files || {});
    if (!parsed.success) {
      return res.status(422).json({
        error: 'Erro de validação',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const documentosParaValidacao = [
      {
        slot: 'document_front',
        label: 'Documento pessoal – Frente',
        tipo_esperado: 'rg_ou_cnh_frente',
        mimetype: req.files?.document_front?.[0]?.mimetype || null,
        size_bytes: req.files?.document_front?.[0]?.size ?? null,
        content_base64: parsed.data.document_front_base64 || null,
        ocr_text: null,
        metadata: { field: 'document_front' },
      },
      {
        slot: 'document_back',
        label: 'Documento pessoal – Verso',
        tipo_esperado: 'rg_verso',
        mimetype: req.files?.document_back?.[0]?.mimetype || null,
        size_bytes: req.files?.document_back?.[0]?.size ?? null,
        content_base64: parsed.data.document_back_base64 || null,
        ocr_text: null,
        metadata: { field: 'document_back' },
      },
      {
        slot: 'energy_bill',
        label: 'Conta de luz',
        tipo_esperado: 'conta_de_luz',
        mimetype: req.files?.energy_bill?.[0]?.mimetype || null,
        size_bytes: req.files?.energy_bill?.[0]?.size ?? null,
        content_base64: parsed.data.energy_bill_base64 || null,
        ocr_text: null,
        metadata: { field: 'energy_bill' },
      },
    ];

    let documentValidation = null;
    try {
      documentValidation = await documentValidationService.validateDocuments({
        documentos: documentosParaValidacao,
        formContext: {
          document_type: parsed.data.document_type,
          power_company: parsed.data.power_company,
          installation_number: parsed.data.installation_number,
          has_pending_debts: parsed.data.has_pending_debts,
          name: parsed.data.name || null,
          document_number: parsed.data.document_number || null,
        },
      });
    } catch (error) {
      console.error('Lead document validation error:', error.message);
      return res.status(502).json({
        error: 'Validação de documentos temporariamente indisponível',
        details: { document_validation: null },
      });
    }

    const docs = documentValidation?.documentos || [];
    const reprovadoPelaIA =
      documentValidation?.status_final === 'reprovado' ||
      documentValidation?.recomendacao === 'solicitar_reenvio';
    const aprovadoMasAlgumDocFalhou =
      documentValidation?.status_final === 'aprovado' &&
      docs.some((d) => d.legivel === false || d.documento_esperado === false);
    const deveReprovar = reprovadoPelaIA || aprovadoMasAlgumDocFalhou;

    if (deveReprovar && docs.length > 0) {
      const problemas = documentValidation.documentos
        .filter((d) => d.problemas_encontrados?.length)
        .flatMap((d) =>
          (d.problemas_encontrados || []).map((p) => `[${d.slot}] ${p}`)
        );
      const mensagemExtra = [];
      docs.forEach((d) => {
        if (d.legivel === false) mensagemExtra.push(`${d.slot}: documento ilegível`);
        if (d.documento_esperado === false) mensagemExtra.push(`${d.slot}: não é o documento esperado`);
      });
      return res.status(422).json({
        error: 'Documentos não aprovados. Corrija e reenvie.',
        document_validation: documentValidation,
        details: {
          document_validation: [...mensagemExtra, ...(problemas.length ? problemas : ['Um ou mais documentos não passaram na validação.'])],
        },
      });
    }

    const leadId = await insertLead(parsed.data);

    await registerLeadProgressLog(req, {
      sessionId: typeof body.session_id === 'string' ? body.session_id.slice(0, MAX_SESSION_ID_LENGTH) : null,
      eventType: 'lead_submitted',
      stepIndex: 5,
      stepId: 'final',
      payloadJson: JSON.stringify({
        lead_id: leadId,
        document_number: parsed.data.document_number,
        email: parsed.data.email,
        document_validation_status: documentValidation?.status_final || null,
      }),
    });

    return res.status(201).json({
      id: leadId,
      message: 'Lead registrado com sucesso',
      document_validation: documentValidation,
    });
  } catch (err) {
    console.error('Lead insert error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao processar solicitação' });
  }
});

router.post('/progress', async (req, res) => {
  try {
    const { session_id, step_index, step_id, values } = req.body || {};
    const sessionId = typeof session_id === 'string' ? session_id.trim() : '';
    const stepIndex = Number(step_index);

    if (!sessionId || sessionId.length > MAX_SESSION_ID_LENGTH) {
      return res.status(400).json({ error: 'session_id inválido' });
    }
    if (!Number.isInteger(stepIndex) || stepIndex < CACHE_START_STEP_INDEX) {
      return res.status(400).json({ error: 'step_index inválido para cache progressivo' });
    }

    const safeValues = sanitizeProgressValues(values);
    const snapshot = {
      session_id: sessionId,
      step_index: stepIndex,
      step_id: typeof step_id === 'string' ? step_id.slice(0, 64) : null,
      values: safeValues,
      updated_at: new Date().toISOString(),
    };

    await saveLeadProgress(sessionId, snapshot);
    await registerLeadProgressLog(req, {
      sessionId,
      eventType: 'step_progress_saved',
      stepIndex,
      stepId: snapshot.step_id,
      payloadJson: JSON.stringify(snapshot),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Save lead progress error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao salvar progresso' });
  }
});

router.get('/progress/:sessionId', async (req, res) => {
  try {
    const sessionId = String(req.params.sessionId || '').trim();
    if (!sessionId || sessionId.length > MAX_SESSION_ID_LENGTH) {
      return res.status(400).json({ error: 'session_id inválido' });
    }

    const snapshot = await getLeadProgress(sessionId);
    if (!snapshot) {
      return res.status(404).json({ error: 'Progresso não encontrado' });
    }

    return res.status(200).json(snapshot);
  } catch (err) {
    console.error('Get lead progress error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao buscar progresso' });
  }
});

router.delete('/progress/:sessionId', async (req, res) => {
  try {
    const sessionId = String(req.params.sessionId || '').trim();
    if (!sessionId || sessionId.length > MAX_SESSION_ID_LENGTH) {
      return res.status(400).json({ error: 'session_id inválido' });
    }

    await clearLeadProgress(sessionId);
    await registerLeadProgressLog(req, {
      sessionId,
      eventType: 'step_progress_cleared',
      stepIndex: null,
      stepId: null,
      payloadJson: null,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Clear lead progress error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao limpar progresso' });
  }
});

router.get('/nao-verificado', async (req, res) => {
  try {
    const leads = await listLeadsByEligibilityStatus('nao_verificado');
    return res.status(200).json(leads);
  } catch (err) {
    console.error('List leads nao_verificado error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao listar leads nao_verificado' });
  }
});

router.patch('/eligibility', async (req, res) => {
  try {
    const { document_number, eligibility_status } = req.body || {};

    if (!document_number || !eligibility_status) {
      return res.status(400).json({
        error: 'Parâmetros obrigatórios ausentes',
        details: {
          document_number: !document_number ? ['Informe o número do documento'] : undefined,
          eligibility_status: !eligibility_status ? ['Informe o novo status de elegibilidade'] : undefined,
        },
      });
    }

    const allowedStatuses = ['elegivel', 'nao_elegivel', 'cadastrado', 'nao_verificado'];
    if (!allowedStatuses.includes(eligibility_status)) {
      return res.status(400).json({
        error: 'Valor de eligibility_status inválido',
        details: {
          eligibility_status: [
            'Valores permitidos: elegivel, nao_elegivel, cadastrado, nao_verificado',
          ],
        },
      });
    }

    const updatedCount = await updateLeadEligibilityByDocument(document_number, eligibility_status);

    if (updatedCount === 0) {
      return res.status(404).json({
        error: 'Lead não encontrado para o documento informado',
      });
    }

    return res.status(200).json({
      updated: updatedCount,
      message: 'Status de elegibilidade atualizado com sucesso',
    });
  } catch (err) {
    console.error('Update lead eligibility error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao atualizar eligibility_status' });
  }
});

// ---- Logs de formulário (rotas mais específicas) ----

router.get('/logs/search', async (req, res) => {
  try {
    const {
      session_id,
      event_type,
      document_number,
      created_from,
      created_to,
      limit,
      offset,
    } = req.query;

    const logs = await listLeadFormLogs({
      session_id,
      event_type,
      document_number,
      created_from,
      created_to,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    return res.status(200).json(logs);
  } catch (err) {
    console.error('Search lead form logs error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao listar logs de formulário' });
  }
});

router.get('/logs/:logId', async (req, res) => {
  try {
    const logId = Number(req.params.logId);
    if (!Number.isInteger(logId) || logId <= 0) {
      return res.status(400).json({ error: 'ID de log inválido' });
    }

    const log = await getLeadFormLogById(logId);
    if (!log) {
      return res.status(404).json({ error: 'Log não encontrado' });
    }

    return res.status(200).json(log);
  } catch (err) {
    console.error('Get lead form log by id error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao buscar log de formulário' });
  }
});

router.delete('/logs/:logId', async (req, res) => {
  try {
    const logId = Number(req.params.logId);
    if (!Number.isInteger(logId) || logId <= 0) {
      return res.status(400).json({ error: 'ID de log inválido' });
    }

    const deleted = await deleteLeadFormLogById(logId);
    if (deleted === 0) {
      return res.status(404).json({ error: 'Log não encontrado' });
    }

    return res.status(200).json({ message: 'Log removido com sucesso' });
  } catch (err) {
    console.error('Delete lead form log by id error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao remover log de formulário' });
  }
});

router.get('/:id/logs', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID de lead inválido' });
    }

    const { limit, offset } = req.query;
    const logs = await listLeadFormLogsByLeadId(id, {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    return res.status(200).json(logs);
  } catch (err) {
    console.error('List lead logs by lead id error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao listar logs do lead' });
  }
});

// ---- CRUD de lead por ID ----

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID de lead inválido' });
    }

    const lead = await getLeadById(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    return res.status(200).json(lead);
  } catch (err) {
    console.error('Get lead by id error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao buscar lead' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID de lead inválido' });
    }

    const { status, eligibility_status, representante_id, id_campaign } = req.body || {};

    const updated = await updateLeadById(id, {
      status,
      eligibility_status,
      representante_id,
      id_campaign,
    });

    if (updated === 0) {
      return res.status(404).json({ error: 'Lead não encontrado ou nenhum campo para atualizar' });
    }

    const lead = await getLeadById(id);
    return res.status(200).json({
      message: 'Lead atualizado com sucesso',
      lead,
    });
  } catch (err) {
    console.error('Update lead by id error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao atualizar lead' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID de lead inválido' });
    }

    const deleted = await softDeleteLeadById(id);
    if (deleted === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    return res.status(200).json({ message: 'Lead marcado como deletado (status=deleted)' });
  } catch (err) {
    console.error('Soft delete lead by id error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao remover lead' });
  }
});

export default router;
