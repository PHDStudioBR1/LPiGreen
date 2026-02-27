import { z } from 'zod';

function stripOptional(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\D/g, '');
}

function parseBrDate(str) {
  if (typeof str !== 'string') return null;
  const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

const cpfCnpjRefine = (val) => {
  const digits = stripOptional(val || '');
  if (digits.length === 11) {
    // CPF basic validation
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i], 10) * (10 - i);
    let d1 = (sum * 10) % 11; if (d1 === 10) d1 = 0;
    if (d1 !== parseInt(digits[9], 10)) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i], 10) * (11 - i);
    let d2 = (sum * 10) % 11; if (d2 === 10) d2 = 0;
    return d2 === parseInt(digits[10], 10);
  }
  if (digits.length === 14) {
    // CNPJ basic validation
    if (/^(\d)\1{13}$/.test(digits)) return false;
    const weights1 = [5,4,3,2,9,8,7,6,5,4,3,2];
    const weights2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
    let s1 = 0; for (let i = 0; i < 12; i++) s1 += parseInt(digits[i], 10) * weights1[i];
    let d1 = s1 % 11; d1 = d1 < 2 ? 0 : 11 - d1;
    if (d1 !== parseInt(digits[12], 10)) return false;
    let s2 = 0; for (let i = 0; i < 13; i++) s2 += parseInt(digits[i], 10) * weights2[i];
    let d2 = s2 % 11; d2 = d2 < 2 ? 0 : 11 - d2;
    return d2 === parseInt(digits[13], 10);
  }
  return false;
};

export const leadSchema = z.object({
  // 1.1 Landing
  cep_landing: z.string().min(1, 'CEP é obrigatório').max(10),
  valor_conta: z.union([z.string(), z.number()]).transform((v) => {
    if (typeof v === 'number') return v;
    const s = String(v).replace(/\./g, '').replace(',', '.');
    const n = parseFloat(s) || 0;
    if (s && !s.includes('.')) return (n / 100);
    return n;
  }).pipe(z.number().min(0.01, 'Valor da conta é obrigatório')),
  // 1.2 Cadastro
  document_number: z.string().min(1, 'CPF ou CNPJ é obrigatório').refine(cpfCnpjRefine, 'CPF ou CNPJ inválido'),
  name: z.string().min(2, 'Nome completo é obrigatório').max(255),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória')
    .transform((d) => {
      const p = parseBrDate(d);
      if (!p) return d;
      const y = p.getFullYear();
      const m = String(p.getMonth() + 1).padStart(2, '0');
      const day = String(p.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    })
    .refine((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && new Date(d) < new Date(), 'Data inválida'),
  phone: z.string().min(10, 'WhatsApp inválido'),
  phone_confirm: z.string().min(10, 'Confirme seu celular'),
  email: z.string().email('E-mail inválido'),
  email_confirm: z.string().email('Confirme seu E-mail'),
  // 1.3 Endereço
  cep: z.string().min(1, 'CEP é obrigatório').max(10),
  address: z.string().min(1, 'Endereço é obrigatório').max(255),
  number: z.string().min(1, 'Número é obrigatório').max(20),
  neighborhood: z.string().min(1, 'Bairro é obrigatório').max(120),
  city: z.string().min(1, 'Cidade é obrigatória').max(120),
  state: z.string().length(2, 'Estado inválido'),
  complement: z.string().max(255).optional().nullable().transform((v) => (v === '' ? null : v)),
  // 1.4 Energia e documento
  power_company: z.string().min(1, 'Distribuidora de energia é obrigatória').max(120),
  installation_number: z.string().min(1, 'Número da instalação é obrigatório').max(60),
  discount_option: z.union([z.enum(['8', '10', '12', '14']), z.literal('')]).optional().transform((v) => (v === '' ? null : v)),
  document_type: z.string().min(1, 'Tipo de documento é obrigatório').max(60),
  // Documentos em base64 (preenchidos pela rota a partir dos buffers de upload)
  document_front_base64: z.string().optional().nullable(),
  document_back_base64: z.string().optional().nullable(),
  // 1.5 Procurador e conta
  has_procurator: z.union([z.string(), z.number()]).optional().transform((v) => (v === 'sim' || v === 'Sim' || v === 1 || v === '1') ? 1 : 0),
  energy_bill_password: z.string().max(255).optional().nullable().transform((v) => (v === '' ? null : v)),
  energy_bill_base64: z.string().optional().nullable(),
  has_pending_debts: z.union([z.string(), z.number()])
    .refine((v) => v !== '' && v != null, { message: 'Informe se possui débitos', path: ['has_pending_debts'] })
    .transform((v) => (v === 'sim' || v === 'Sim' || v === 1 || v === '1') ? 1 : 0),
  payment_proof_base64: z.string().optional().nullable(),
  eligibility_status: z.enum(['elegivel', 'nao_elegivel', 'cadastrado', 'nao_verificado']).optional().default('nao_verificado'),
  status: z.string().optional(),
  source: z.string().optional(),
  id_campaign: z.string().optional().nullable().transform((v) => (v === '' ? null : v)),
})
  .refine((data) => String(data.phone).replace(/\D/g, '') === String(data.phone_confirm).replace(/\D/g, ''), { message: 'Celular e confirmação devem ser iguais', path: ['phone_confirm'] })
  .refine((data) => (data.email || '').toLowerCase() === (data.email_confirm || '').toLowerCase(), { message: 'E-mail e confirmação devem ser iguais', path: ['email_confirm'] })
  .refine((data) => data.document_front_base64, { message: 'Documento pessoal – Frente é obrigatório', path: ['document_front_base64'] })
  .refine((data) => data.document_back_base64, { message: 'Documento pessoal – Verso é obrigatório', path: ['document_back_base64'] })
  .refine((data) => data.has_pending_debts !== 1 || data.payment_proof_base64, {
    message: 'Comprovante de pagamento é obrigatório quando há débitos em aberto',
    path: ['payment_proof_base64'],
  });

export function validateLead(body, files = {}) {
  const withBase64 = {
    ...body,
    document_front_base64: body.document_front_base64 ?? (files.document_front?.[0]?.buffer != null ? files.document_front[0].buffer.toString('base64') : null),
    document_back_base64: body.document_back_base64 ?? (files.document_back?.[0]?.buffer != null ? files.document_back[0].buffer.toString('base64') : null),
    energy_bill_base64: body.energy_bill_base64 ?? (files.energy_bill?.[0]?.buffer != null ? files.energy_bill[0].buffer.toString('base64') : null),
    payment_proof_base64: body.payment_proof_base64 ?? (files.payment_proof?.[0]?.buffer != null ? files.payment_proof[0].buffer.toString('base64') : null),
  };
  return leadSchema.safeParse(withBase64);
}
