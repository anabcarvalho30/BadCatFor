import { Router } from 'express';

const router = Router();

// Rota de teste (GET /support)
router.get('/', (req, res) => {
  res.json({ message: "Rota de Suporte funcionando!" });
});

// Export default obrigatório
export default router;