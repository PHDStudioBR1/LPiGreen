import express from 'express';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { apiKeyAuth } from './middleware/auth.js';
import leadsRouter from './routes/leads.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/leads', apiKeyAuth, leadsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno ao processar solicitação' });
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`API listening on port ${config.port}`);
});
