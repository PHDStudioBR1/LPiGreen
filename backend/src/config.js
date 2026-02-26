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
  apiKey: process.env.API_KEY || '',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
};
