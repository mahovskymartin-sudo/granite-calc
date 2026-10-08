import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

export const offersRouter = Router();
const prisma = new PrismaClient();

offersRouter.use(authenticate);

offersRouter.get('/', async (req: AuthRequest, res) => {
  const offers = await prisma.offer.findMany({
    where: { createdBy: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: offers });
});

offersRouter.get('/:id', async (req: AuthRequest, res) => {
  const offer = await prisma.offer.findFirst({
    where: { id: req.params.id, createdBy: req.userId! }
  });
  if (!offer) return res.status(404).json({ error: 'Not found' });
  res.json({ data: offer });
});

offersRouter.post('/', async (req: AuthRequest, res) => {
  try {
    const { customer, date, validDays, params, lines, totalCzk } = req.body;
    const offer = await prisma.offer.create({
      data: { customer, date: new Date(date), validDays, params, lines, totalCzk, createdBy: req.userId! }
    });
    res.status(201).json({ data: offer });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

offersRouter.put('/:id', async (req: AuthRequest, res) => {
  try {
    const offer = await prisma.offer.updateMany({
      where: { id: req.params.id, createdBy: req.userId! },
      data: req.body
    });
    res.json({ data: offer });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

offersRouter.delete('/:id', async (req: AuthRequest, res) => {
  await prisma.offer.deleteMany({
    where: { id: req.params.id, createdBy: req.userId! }
  });
  res.json({ data: { deleted: true } });
});
