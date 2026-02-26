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

export async function insertLead(lead) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const representanteId = await getNextRepresentativeId(connection);

    const [result] = await connection.execute(
      `INSERT INTO leads (
        cep_landing, valor_conta, document_number, name, birth_date, phone, phone_confirm,
        email, email_confirm, cep, address, number, neighborhood, city, state, complement,
        power_company, installation_number, discount_option, document_type,
        document_front_path, document_back_path, has_procurator, energy_bill_password,
        energy_bill_path, has_pending_debts, payment_proof_path,
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
        lead.document_front_path ?? null,
        lead.document_back_path ?? null,
        lead.has_procurator ?? 0,
        lead.energy_bill_password ?? null,
        lead.energy_bill_path ?? null,
        lead.has_pending_debts ?? 0,
        lead.payment_proof_path ?? null,
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
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listLeadsByEligibilityStatus(status = 'nao_verificado') {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
       id,
       document_number,
       name,
       email,
       phone,
       eligibility_status,
       status,
       source,
       representante_id,
       created_at
     FROM leads
     WHERE eligibility_status = ?
     ORDER BY created_at DESC`,
    [status]
  );
  return rows;
}

