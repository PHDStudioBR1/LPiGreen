import { getPool } from './db.js';

export async function listRepresentantes() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, nome, link_cadastro, tipo_produto, ativo
     FROM representantes
     ORDER BY id`
  );
  return rows;
}

