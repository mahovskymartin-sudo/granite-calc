import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@granite.cz' } });
  if (existing) {
    console.log('Admin user already exists');
    return;
  }

  const password = await bcrypt.hash('granite2024', 10);
  await prisma.user.create({
    data: { email: 'admin@granite.cz', name: 'Admin', password }
  });

  // Default settings
  await prisma.appSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      exchangeRate: 5.85,
      truckPriceBulk: 0,
      truckPricePallet: 0,
      defaultMarginBulk: 0.20,
      defaultMarginPallet: 0.12,
    }
  });

  // Default loms
  for (const id of ['Lom1', 'Lom2', 'Lom3', 'Lom4']) {
    await prisma.lom.upsert({
      where: { id },
      update: {},
      create: { id, name: id, prices: {} }
    });
  }

  console.log('✅ Seed complete');
  console.log('   Email: admin@granite.cz');
  console.log('   Heslo: granite2024');
}

main().catch(console.error).finally(() => prisma.$disconnect());
