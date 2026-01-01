import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /games
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

// GET /games/:slug
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