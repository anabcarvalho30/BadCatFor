import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post(
  '/register', 
  upload.fields([
    { name: 'photo', maxCount: 1 }, 
    { name: 'banner', maxCount: 1 }
  ]), 
  register
);
router.post('/login', login);

export default router;