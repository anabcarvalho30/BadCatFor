import { Router } from 'express';
import { createPost, listPosts } from '../controllers/post.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // Importante: usar .js no final

const router = Router();

// GET http://localhost:3000/posts
router.get('/', listPosts); 

// POST http://localhost:3000/posts
router.post('/', authMiddleware, createPost);

export default router;