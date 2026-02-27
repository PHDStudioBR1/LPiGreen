import express from 'express';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { apiKeyAuth } from './middleware/auth.js';
import leadsRouter from './routes/leads.js';
import representantesRouter from './routes/representantes.js';

const app = express();

app.set('trust proxy', 1);

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

app.get(['/health', '/api/health'], (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/leads', apiKeyAuth, leadsRouter);
app.use('/api/representantes', apiKeyAuth, representantesRouter);

// ---------- ANEEL distribuidoras ----------
const ANEEL_DISTRIBUIDORAS_URL =
  'https://dadosabertos.aneel.gov.br/api/3/action/datastore_search_sql?sql=SELECT%20%22SigAgente%22%2C%20%22NumCNPJDistribuidora%22%2C%20%22DscBaseTarifaria%22%20FROM%20%22fcf2906c-7c32-4b9b-a637-054e7a5234f4%22%20GROUP%20BY%20%22SigAgente%22%2C%20%22NumCNPJDistribuidora%22%2C%20%22DscBaseTarifaria%22%20LIMIT%201000';

const FALLBACK_DISTRIBUIDORAS = [
  'AME',
  'BOA VISTA',
  'CEA',
  'CEEE-D',
  'CELESC',
  'CEMIG-D',
  'CEMIRIM',
  'CERFOX',
  'CERGAL',
  'CERILUZ',
  'CERMC',
  'CERMISSÕES',
  'CERTAJA',
  'CERTEL ENERGIA',
  'CERR',
  'CFLO',
  'CHESP',
  'COCEL',
  'COELBA',
  'COPEL-DIS',
  'COPREL',
  'COSERN',
  'CPFL JAGUARI',
  'CPFL LESTE PAULI',
  'CPFL MOCOCA',
  'CPFL SANTA CRUZ',
  'CPFL SUL PAULIST',
  'CPFL-PAULISTA',
  'CPFL-PIRATININGA',
  'DCELT',
  'DEMEI',
  'DMED',
  'EAC',
  'EBO',
  'EDEVP',
  'EDP ES',
  'EDP SP',
  'EEB',
  'EFLJC',
  'EFLUL',
  'ELEKTRO',
  'ELETROCAR',
  'EMR',
  'EMS',
  'ENEL CE',
  'ENEL RJ',
  'ENF',
  'EQUATORIAL AL',
  'EQUATORIAL GO',
  'EQUATORIAL MA',
  'EQUATORIAL PA',
  'EQUATORIAL PI',
  'ERO',
  'ESS',
  'ETO',
  'LIGHT SESA',
  'Neoenergia Brasília',
  'Neoenergia PE',
  'RGE',
  'RGE SUL',
  'SULGIPE',
];

app.get('/api/aneel/distribuidoras', async (req, res) => {
  try {
    const response = await fetch(ANEEL_DISTRIBUIDORAS_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('Erro ao consultar ANEEL:', response.status, text);
      return res.status(200).json({
        success: true,
        fromCache: true,
        result: {
          records: FALLBACK_DISTRIBUIDORAS.map((nome) => ({
            SigAgente: nome,
            NumCNPJDistribuidora: '',
            DscBaseTarifaria: '',
          })),
          fields: [
            { id: 'SigAgente', type: 'text' },
            { id: 'NumCNPJDistribuidora', type: 'text' },
            { id: 'DscBaseTarifaria', type: 'text' },
          ],
        },
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro interno /api/aneel/distribuidoras:', error);
    return res.status(200).json({
      success: true,
      fromCache: true,
      result: {
        records: FALLBACK_DISTRIBUIDORAS.map((nome) => ({
          SigAgente: nome,
          NumCNPJDistribuidora: '',
          DscBaseTarifaria: '',
        })),
        fields: [
          { id: 'SigAgente', type: 'text' },
          { id: 'NumCNPJDistribuidora', type: 'text' },
          { id: 'DscBaseTarifaria', type: 'text' },
        ],
      },
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno ao processar solicitação' });
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`API listening on port ${config.port}`);
});
