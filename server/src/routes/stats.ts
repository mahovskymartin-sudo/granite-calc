import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

export const statsRouter = Router();
const prisma = new PrismaClient();

statsRouter.use(authenticate);

statsRouter.get('/', async (_req, res) => {
  try {
    const offers = await prisma.offer.findMany({
      select: { totalCzk: true, createdAt: true, lines: true, customer: true }
    });
    const totalRevenue = offers.reduce((s, o) => s + o.totalCzk, 0);
    const count = offers.length;
    const avgValue = count > 0 ? totalRevenue / count : 0;
    res.json({ data: { totalRevenue, count, avgValue } });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
