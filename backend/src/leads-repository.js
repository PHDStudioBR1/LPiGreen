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
  id, cep_landing, valor_conta, document_number, name, birth_date, phone, phone_confirm,
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

