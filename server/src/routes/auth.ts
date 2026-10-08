import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signToken, authenticate, AuthRequest } from '../middleware/auth';

export const authRouter = Router();
const prisma = new PrismaClient();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(401).json({ error: 'Neplatné přihlašovací údaje' });

    const token = signToken(user.id);
    res.json({ data: { token, user: { id: user.id, email: user.email, name: user.name } } });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.get('/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: user });
});

// Register — only allow max 5 users
authRouter.post('/register', async (req, res) => {
  try {
    const count = await prisma.user.count();
    if (count >= 5) return res.status(403).json({ error: 'Max 5 uživatelů' });

    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email již existuje' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    const token = signToken(user.id);
    res.json({ data: { token, user: { id: user.id, email: user.email, name: user.name } } });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
