import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

export const settingsRouter = Router();
export const statsRouter = Router();
const prisma = new PrismaClient();

settingsRouter.use(authenticate);
statsRouter.use(authenticate);

settingsRouter.get('/', async (_req, res) => {
  const s = await prisma.appSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: { id: 'global' }
  });
  res.json({ data: s });
});

settingsRouter.put('/', async (req, res) => {
  const s = await prisma.appSettings.upsert({
    where: { id: 'global' },
    update: req.body,
    create: { id: 'global', ...req.body }
  });
  res.json({ data: s });
});

// Basic stats
statsRouter.get('/', async (_req, res) => {
  const offers = await prisma.offer.findMany({ select: { totalCzk: true, createdAt: true, lines: true } });
  const totalRevenue = offers.reduce((s, o) => s + o.totalCzk, 0);
  const count = offers.length;
  res.json({ data: { totalRevenue, count, offers } });
});
