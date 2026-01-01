import { prisma } from '../lib/prisma.js';

export const createPost = async (req, res) => {
  const { content, image } = req.body;
  const userId = req.userId;

  try {
    const post = await prisma.post.create({
      data: {
        content,
        image,
        userId,
      },
    });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar post' });
  }
};

export const listPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, photo: true }
        },
        _count: {
          select: { favorites: true }
        }
      }
    });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};