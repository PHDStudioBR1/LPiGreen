import { Router } from 'express';
import { listRepresentantes } from '../representantes-repository.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const reps = await listRepresentantes();
    return res.status(200).json(reps);
  } catch (err) {
    console.error('List representantes error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao listar representantes' });
  }
});

export default router;

