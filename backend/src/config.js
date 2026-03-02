import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  mysql: {
    host: process.env.MYSQL_HOST || 'mysql',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'igreen_app',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'igreen_captacao',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
    ttlSeconds: parseInt(process.env.REDIS_TTL_SECONDS || '259200', 10),
  },
  apiKey: process.env.API_KEY || '',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
  docAi: {
    provider: (process.env.DOC_AI_PROVIDER || '').toLowerCase(),
    timeoutMs: parseInt(process.env.DOC_AI_TIMEOUT_MS || '8000', 10),
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    },
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    },
  },
};
