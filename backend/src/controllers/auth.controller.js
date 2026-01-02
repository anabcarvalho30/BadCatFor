import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'Email já cadastrado' });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hash,
      },
    });

   user.passwordHash = undefined;
    return res.status(201).json(user);

  } catch (error) {
    console.error("ERRO DETALHADO NO REGISTRO:", error);

    return res.status(500).json({ 
      error: 'Erro ao registrar usuário', 
      details: error.message 
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    user.passwordHash = undefined;
    return res.json({ user, token });
  } catch (error) {
    return res.status(500).json({ error: 'Erro no login' });
  }
};