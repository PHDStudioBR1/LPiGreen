import { getPool } from './db.js';

const cache = new Map();
const CACHE_TTL_MS = 30_000;

function cacheKey(namespace, key) {
  return `${namespace}::${key}`;
}

function getCached(namespace, key) {
  const entry = cache.get(cacheKey(namespace, key));
  if (!entry) return undefined;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(cacheKey(namespace, key));
    return undefined;
  }
  return entry.value;
}

function setCached(namespace, key, value) {
  cache.set(cacheKey(namespace, key), { value, ts: Date.now() });
}

export function invalidateCache(namespace, key) {
  if (key) {
    cache.delete(cacheKey(namespace, key));
  } else {
    for (const k of cache.keys()) {
      if (k.startsWith(`${namespace}::`)) cache.delete(k);
    }
  }
}

export async function getConfigValue(namespace, key) {
  const cached = getCached(namespace, key);
  if (cached !== undefined) return cached;

  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT value FROM config WHERE namespace = ? AND `key` = ? LIMIT 1',
    [namespace, key],
  );
  const value = rows.length > 0 ? rows[0].value : null;
  setCached(namespace, key, value);
  return value;
}

export async function setConfigValue(namespace, key, value) {
  const pool = getPool();
  await pool.query(
    `INSERT INTO config (namespace, \`key\`, value)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [namespace, key, value],
  );
  invalidateCache(namespace, key);
}

export async function getConfigByNamespace(namespace) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT `key`, value FROM config WHERE namespace = ?',
    [namespace],
  );
  const result = {};
  for (const row of rows) {
    result[row.key] = row.value;
    setCached(namespace, row.key, row.value);
  }
  return result;
}
