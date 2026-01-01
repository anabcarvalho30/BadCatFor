import { Router } from 'express';
import { prisma } from '../lib/prisma.js'; // Note os dois pontos (..) para voltar pasta

const router = Router();

// GET /games -> Lista todos os jogos
router.get('/', async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });
    return res.json(games);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar jogos" });
  }
});

// GET /games/:slug -> Detalhes de um jogo específico
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        comments: {
          include: {
            user: { select: { name: true, photo: true } }
          }
        }
      }
    });

    if (!game) return res.status(404).json({ error: "Jogo não encontrado" });

    return res.json(game);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar jogo" });
  }
});

export default router;