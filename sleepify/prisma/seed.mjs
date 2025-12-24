// prisma/seed.mjs
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const filepath = path.join('prisma', 'data', 'dream_symbols_250_unique.json');

async function main() {
  console.log('🌱 Starting seed...');

  const rawData = fs.readFileSync(filepath, 'utf-8');
  const symbols = JSON.parse(rawData);

  console.log(`📊 Seeding ${symbols.length} symbols...`);

  await prisma.symbol.createMany({
    data: symbols.map((s) => ({
      name: s.name,
      category: s.category,
      description: s.description,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${symbols.length} symbols`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
