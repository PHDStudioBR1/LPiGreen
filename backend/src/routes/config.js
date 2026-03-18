import { Router } from 'express';
import {
  getConfigByNamespace,
  getConfigValue,
  setConfigValue,
} from '../config-repository.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { namespace, key } = req.query;
    if (!namespace) {
      return res.status(400).json({ error: 'Query param "namespace" é obrigatório' });
    }

    if (key) {
      const value = await getConfigValue(namespace, key);
      return res.json({ namespace, key, value });
    }

    const values = await getConfigByNamespace(namespace);
    return res.json({ namespace, values });
  } catch (error) {
    console.error('GET /config error:', error.message);
    return res.status(500).json({ error: 'Erro ao buscar configuração' });
  }
});

router.patch('/', async (req, res) => {
  try {
    const { namespace, key, value } = req.body;
    if (!namespace || !key) {
      return res
        .status(400)
        .json({ error: 'Campos "namespace" e "key" são obrigatórios' });
    }
    if (value === undefined || value === null) {
      return res.status(400).json({ error: 'Campo "value" é obrigatório' });
    }

    await setConfigValue(namespace, key, String(value));
    return res.json({ namespace, key, value: String(value) });
  } catch (error) {
    console.error('PATCH /config error:', error.message);
    return res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
});

export default router;
