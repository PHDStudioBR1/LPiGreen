#!/usr/bin/env node
/**
 * Apaga todos os registros da tabela `leads`.
 * Usa as variáveis de ambiente do backend (MYSQL_*, .env).
 *
 * Uso (a partir da pasta backend):
 *   node scripts/delete-all-leads.js
 *
 * Ou com confirmação (variável de ambiente):
 *   CONFIRM=yes node scripts/delete-all-leads.js
 */

import { getPool } from '../src/db.js';

async function main() {
  const confirm = process.env.CONFIRM === 'yes' || process.env.CONFIRM === '1';
  if (!confirm) {
    console.error('Para apagar todos os leads, execute:');
    console.error('  CONFIRM=yes node scripts/delete-all-leads.js');
    process.exit(1);
  }

  const pool = getPool();
  const [result] = await pool.execute('DELETE FROM leads');
  const count = result.affectedRows;
  console.log(`Leads apagados: ${count}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
