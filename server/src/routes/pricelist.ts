import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

export const pricellistRouter = Router();
const prisma = new PrismaClient();

pricellistRouter.use(authenticate);

pricellistRouter.get('/', async (_req, res) => {
  const loms = await prisma.lom.findMany();
  res.json({ data: loms });
});

pricellistRouter.put('/:id', async (req, res) => {
  try {
    const lom = await prisma.lom.upsert({
      where: { id: req.params.id },
      update: req.body,
      create: { id: req.params.id, ...req.body }
    });
    res.json({ data: lom });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
