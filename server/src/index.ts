import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { offersRouter } from './routes/offers';
import { pricellistRouter } from './routes/pricelist';
import { settingsRouter } from './routes/settings';
import { statsRouter } from './routes/stats';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',     authRouter);
app.use('/api/offers',   offersRouter);
app.use('/api/pricelist', pricellistRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/stats',    statsRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`🪨 Granite Calc API running on port ${PORT}`);
});
