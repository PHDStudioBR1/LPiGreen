import { Router } from 'express';
import { insertLead, listLeadsByEligibilityStatus } from '../leads-repository.js';
import { validateLead } from '../validation.js';
import { uploadFields } from '../middleware/upload.js';

const router = Router();

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
    const leadId = await insertLead(parsed.data);
    return res.status(201).json({ id: leadId, message: 'Lead registrado com sucesso' });
  } catch (err) {
    console.error('Lead insert error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao processar solicitação' });
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

export default router;
