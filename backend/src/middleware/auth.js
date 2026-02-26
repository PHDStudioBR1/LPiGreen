import { config } from '../config.js';

export function apiKeyAuth(req, res, next) {
  const key = req.headers['x-api-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  if (!config.apiKey) {
    return next();
  }
  if (!key || key !== config.apiKey) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
}
