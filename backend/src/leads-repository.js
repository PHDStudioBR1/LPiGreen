import { getPool } from './db.js';

async function getNextRepresentativeId(connection) {
  const [rows] = await connection.query(
    `
      SELECT r.id
      FROM representantes r
      LEFT JOIN leads l ON l.representante_id = r.id
      GROUP BY r.id
      ORDER BY COUNT(l.id) ASC, r.id ASC
      LIMIT 1
    `
  );

  if (!rows || rows.length === 0) {
    throw new Error('Nenhum representante cadastrado para receber leads');
  }

  return rows[0].id;
}

function isConnectionClosedError(err) {
  const msg = (err && err.message) ? String(err.message) : '';
  return /closed state|Connection lost|ECONNRESET|ECONNREFUSED|broken pipe/i.test(msg);
}

export async function insertLead(lead, _retry = false) {
  const pool = getPool();
  const connection = await pool.getConnection();
  let released = false;

  try {
    await connection.beginTransaction();

    const representanteId = await getNextRepresentativeId(connection);

    const [result] = await connection.execute(
      `INSERT INTO leads (
        cep_landing, valor_conta, document_number, name, birth_date, phone, phone_confirm,
        email, email_confirm, cep, address, number, neighborhood, city, state, complement,
        power_company, installation_number, discount_option, document_type,
        document_front_base64, document_back_base64, has_procurator, energy_bill_password,
        energy_bill_base64, has_pending_debts, payment_proof_base64,
        representante_id, eligibility_status, status, source, id_campaign
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lead.cep_landing,
        lead.valor_conta,
        lead.document_number,
        lead.name,
        lead.birth_date,
        lead.phone,
        lead.phone_confirm,
        lead.email,
        lead.email_confirm,
        lead.cep,
        lead.address,
        lead.number,
        lead.neighborhood,
        lead.city,
        lead.state,
        lead.complement ?? null,
        lead.power_company ?? null,
        lead.installation_number,
        lead.discount_option ?? null,
        lead.document_type ?? null,
        lead.document_front_base64 ?? null,
        lead.document_back_base64 ?? null,
        lead.has_procurator ?? 0,
        lead.energy_bill_password ?? null,
        lead.energy_bill_base64 ?? null,
        lead.has_pending_debts ?? 0,
        lead.payment_proof_base64 ?? null,
        representanteId,
        lead.eligibility_status ?? 'nao_verificado',
        lead.status ?? 'new',
        lead.source ?? 'web',
        lead.id_campaign ?? null,
      ]
    );

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback().catch(() => {});
    if (isConnectionClosedError(error) && !_retry) {
      connection.release();
      released = true;
      return insertLead(lead, true);
    }
    throw error;
  } finally {
    if (!released) connection.release();
  }
}

const LEAD_SELECT_ALL = `
  id, session_id, cep_landing, valor_conta, document_number, name, birth_date, phone, phone_confirm,
  email, email_confirm, cep, address, number, neighborhood, city, state, complement,
  power_company, installation_number, discount_option, document_type,
  document_front_base64, document_back_base64, has_procurator, energy_bill_password,
  energy_bill_base64, has_pending_debts, payment_proof_base64,
  representante_id, eligibility_status, status, source, id_campaign, created_at, updated_at
`;

export async function listLeadsByEligibilityStatus(status = 'nao_verificado') {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT ${LEAD_SELECT_ALL}
     FROM leads
     WHERE eligibility_status = ?
     ORDER BY created_at DESC`,
    [status]
  );
  return rows;
}

export async function updateLeadEligibilityByDocument(documentNumber, eligibilityStatus) {
  const pool = getPool();
  const [result] = await pool.execute(
    `UPDATE leads
     SET eligibility_status = ?
     WHERE document_number = ?`,
    [eligibilityStatus, documentNumber]
  );
  return result.affectedRows;
}

export async function listLeads(filters = {}) {
  const pool = getPool();

  const {
    status,
    eligibility_status: eligibilityStatus,
    representante_id: representanteId,
    document_number: documentNumber,
    created_from: createdFrom,
    created_to: createdTo,
    limit = 50,
    offset = 0,
  } = filters;

  const where = [];
  const params = [];

  if (status) {
    where.push('status = ?');
    params.push(status);
  }
  if (eligibilityStatus) {
    where.push('eligibility_status = ?');
    params.push(eligibilityStatus);
  }
  if (representanteId) {
    where.push('representante_id = ?');
    params.push(representanteId);
  }
  if (documentNumber) {
    where.push('document_number LIKE ?');
    params.push(`%${documentNumber}%`);
  }
  if (createdFrom) {
    where.push('created_at >= ?');
    params.push(createdFrom);
  }
  if (createdTo) {
    where.push('created_at <= ?');
    params.push(createdTo);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `
      SELECT ${LEAD_SELECT_ALL}
      FROM leads
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ?
      OFFSET ?
    `,
    [...params, Number(limit), Number(offset)]
  );

  return rows;
}

export async function getLeadById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT ${LEAD_SELECT_ALL} FROM leads WHERE id = ?`,
    [id]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows[0];
}

export async function getLeadBySessionId(sessionId) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT ${LEAD_SELECT_ALL} FROM leads WHERE session_id = ?`,
    [sessionId]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows[0];
}

/** Normaliza valores do formulário (progress) para o banco (draft). */
function normalizeDraftValue(key, value) {
  if (value === undefined || value === null || value === '') return null;
  if (key === 'valor_conta') {
    const num = parseFloat(String(value).replace(/\./g, '').replace(',', '.')) || null;
    return num;
  }
  if (key === 'birth_date') {
    const s = String(value).trim();
    const match = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    return s || null;
  }
  if (key === 'has_pending_debts') {
    return String(value).toLowerCase() === 'sim' ? 1 : 0;
  }
  return typeof value === 'string' ? value.trim() : value;
}

const DRAFT_UPSERT_FIELDS = [
  'cep_landing', 'valor_conta', 'document_number', 'name', 'birth_date',
  'phone', 'phone_confirm', 'email', 'email_confirm', 'cep', 'address',
  'number', 'neighborhood', 'city', 'state', 'complement', 'power_company',
  'installation_number', 'discount_option', 'document_type', 'energy_bill_password',
  'has_pending_debts',
];

/**
 * Cria ou atualiza um lead rascunho (draft) na tabela leads a partir dos dados
 * salvos a cada passo do formulário. Usado quando o usuário avança de página
 * mesmo sem completar o cadastro.
 */
export async function upsertLeadDraft(sessionId, values, _retry = false) {
  const pool = getPool();
  const connection = await pool.getConnection();
  let released = false;

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query(
      'SELECT id FROM leads WHERE session_id = ?',
      [sessionId]
    );

    const normalized = {};
    for (const key of DRAFT_UPSERT_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;
      const v = normalizeDraftValue(key, values[key]);
      if (v !== undefined) normalized[key] = v;
    }

    if (existing && existing.length > 0) {
      const id = existing[0].id;
      const setParts = [];
      const params = [];
      for (const key of DRAFT_UPSERT_FIELDS) {
        if (!Object.prototype.hasOwnProperty.call(normalized, key)) continue;
        setParts.push(`${key} = ?`);
        params.push(normalized[key]);
      }
      if (setParts.length > 0) {
        params.push(id);
        await connection.execute(
          `UPDATE leads SET ${setParts.join(', ')} WHERE id = ?`,
          params
        );
      }
      await connection.commit();
      return id;
    }

    const representanteId = await getNextRepresentativeId(connection);

    const fields = ['session_id', 'representante_id', 'eligibility_status', 'status', 'source'];
    const placeholders = ['?', '?', '?', '?', '?'];
    const params = [sessionId, representanteId, 'nao_verificado', 'draft', 'web'];

    for (const key of DRAFT_UPSERT_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(normalized, key)) continue;
      fields.push(key);
      placeholders.push('?');
      params.push(normalized[key]);
    }

    const [result] = await connection.execute(
      `INSERT INTO leads (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`,
      params
    );

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback().catch(() => {});
    if (isConnectionClosedError(error) && !_retry) {
      connection.release();
      released = true;
      return upsertLeadDraft(sessionId, values, true);
    }
    throw error;
  } finally {
    if (!released) connection.release();
  }
}

export async function updateLeadById(id, fields) {
  const pool = getPool();

  const allowedFields = ['status', 'eligibility_status', 'representante_id', 'id_campaign'];
  const setParts = [];
  const params = [];

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      setParts.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }

  if (setParts.length === 0) {
    return 0;
  }

  const [result] = await pool.execute(
    `
      UPDATE leads
      SET ${setParts.join(', ')}
      WHERE id = ?
    `,
    [...params, id]
  );

  return result.affectedRows;
}

const FULL_UPDATE_FIELDS = [
  'cep_landing', 'valor_conta', 'document_number', 'name', 'birth_date',
  'phone', 'phone_confirm', 'email', 'email_confirm', 'cep', 'address',
  'number', 'neighborhood', 'city', 'state', 'complement', 'power_company',
  'installation_number', 'discount_option', 'document_type',
  'document_front_base64', 'document_back_base64', 'has_procurator',
  'energy_bill_password', 'energy_bill_base64', 'has_pending_debts',
  'payment_proof_base64', 'eligibility_status', 'source', 'id_campaign',
];

/**
 * Atualiza um lead existente (ex.: draft) com todos os dados do submit final.
 * Limpa session_id e define status = 'new' para virar lead definitivo.
 */
export async function updateLeadFull(id, lead) {
  const pool = getPool();

  const setParts = ['session_id = NULL', 'status = ?'];
  const params = [lead.status ?? 'new'];

  for (const key of FULL_UPDATE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(lead, key)) continue;
    setParts.push(`${key} = ?`);
    const v = lead[key];
    params.push(v === undefined ? null : v);
  }

  params.push(id);

  const [result] = await pool.execute(
    `UPDATE leads SET ${setParts.join(', ')} WHERE id = ?`,
    params
  );

  return result.affectedRows;
}

export async function softDeleteLeadById(id) {
  const pool = getPool();
  const [result] = await pool.execute(
    `
      UPDATE leads
      SET status = 'deleted'
      WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
}

