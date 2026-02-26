import { config } from './config.js';
import { getRedisClient } from './redis.js';

const PROGRESS_PREFIX = 'lead-progress:';

function progressKey(sessionId) {
  return `${PROGRESS_PREFIX}${sessionId}`;
}

export async function saveLeadProgress(sessionId, snapshot) {
  const redis = await getRedisClient();
  const key = progressKey(sessionId);
  await redis.set(key, JSON.stringify(snapshot), {
    EX: config.redis.ttlSeconds,
  });
}

export async function getLeadProgress(sessionId) {
  const redis = await getRedisClient();
  const key = progressKey(sessionId);
  const raw = await redis.get(key);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function clearLeadProgress(sessionId) {
  const redis = await getRedisClient();
  const key = progressKey(sessionId);
  return redis.del(key);
}
