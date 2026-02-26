import { getPool } from './db.js';

function parseJson(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(String(value));
  } catch {
    return null;
  }
}

export async function insertLeadFormLog(logEntry) {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO lead_form_logs (
      session_id,
      event_type,
      step_index,
      step_id,
      payload_json,
      ip_address,
      user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      logEntry.sessionId ?? null,
      logEntry.eventType,
      logEntry.stepIndex ?? null,
      logEntry.stepId ?? null,
      logEntry.payloadJson ?? null,
      logEntry.ipAddress ?? null,
      logEntry.userAgent ?? null,
    ]
  );

  return result.insertId;
}

export async function listLeadFormLogs(filters = {}) {
  const pool = getPool();

  const {
    session_id: sessionId,
    event_type: eventType,
    document_number: documentNumber,
    created_from: createdFrom,
    created_to: createdTo,
    limit = 50,
    offset = 0,
  } = filters;

  const where = [];
  const params = [];

  if (sessionId) {
    where.push('session_id = ?');
    params.push(sessionId);
  }
  if (eventType) {
    where.push('event_type = ?');
    params.push(eventType);
  }
  if (documentNumber) {
    where.push(
      "JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.document_number')) = ?"
    );
    params.push(documentNumber);
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
      SELECT
        id,
        session_id,
        event_type,
        step_index,
        step_id,
        payload_json,
        ip_address,
        user_agent,
        created_at
      FROM lead_form_logs
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ?
      OFFSET ?
    `,
    [...params, Number(limit), Number(offset)]
  );

  return rows.map((row) => ({
    id: row.id,
    session_id: row.session_id,
    event_type: row.event_type,
    step_index: row.step_index,
    step_id: row.step_id,
    payload: parseJson(row.payload_json),
    ip_address: row.ip_address,
    user_agent: row.user_agent,
    created_at: row.created_at,
  }));
}

export async function listLeadFormLogsByLeadId(leadId, { limit = 50, offset = 0 } = {}) {
  const pool = getPool();

  const [rows] = await pool.query(
    `
      SELECT
        lfl.id,
        lfl.session_id,
        lfl.event_type,
        lfl.step_index,
        lfl.step_id,
        lfl.payload_json,
        lfl.ip_address,
        lfl.user_agent,
        lfl.created_at
      FROM lead_form_logs lfl
      JOIN leads l
        ON JSON_UNQUOTE(JSON_EXTRACT(lfl.payload_json, '$.document_number')) = l.document_number
      WHERE l.id = ?
      ORDER BY lfl.created_at DESC
      LIMIT ?
      OFFSET ?
    `,
    [leadId, Number(limit), Number(offset)]
  );

  return rows.map((row) => ({
    id: row.id,
    session_id: row.session_id,
    event_type: row.event_type,
    step_index: row.step_index,
    step_id: row.step_id,
    payload: parseJson(row.payload_json),
    ip_address: row.ip_address,
    user_agent: row.user_agent,
    created_at: row.created_at,
  }));
}

export async function getLeadFormLogById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `
      SELECT
        id,
        session_id,
        event_type,
        step_index,
        step_id,
        payload_json,
        ip_address,
        user_agent,
        created_at
      FROM lead_form_logs
      WHERE id = ?
    `,
    [id]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    id: row.id,
    session_id: row.session_id,
    event_type: row.event_type,
    step_index: row.step_index,
    step_id: row.step_id,
    payload: parseJson(row.payload_json),
    ip_address: row.ip_address,
    user_agent: row.user_agent,
    created_at: row.created_at,
  };
}

export async function deleteLeadFormLogById(id) {
  const pool = getPool();
  const [result] = await pool.execute(
    `
      DELETE FROM lead_form_logs
      WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
}
