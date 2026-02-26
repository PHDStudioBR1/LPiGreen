import { getPool } from './db.js';

export async function insertLead(lead) {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO leads (
      cep_landing, valor_conta, document_number, name, birth_date, phone, phone_confirm,
      email, email_confirm, cep, address, number, neighborhood, city, state, complement,
      power_company, installation_number, discount_option, document_type,
      document_front_path, document_back_path, has_procurator, energy_bill_password,
      energy_bill_path, has_pending_debts, payment_proof_path, status, source, id_campaign
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      lead.status ?? 'new',
      lead.source ?? 'web',
      lead.id_campaign ?? null,
    ]
  );
  return result.insertId;
}
