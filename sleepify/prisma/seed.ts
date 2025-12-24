import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();

async function main() {
  const filepath = path.join(
    __dirname,
    'data',
    'dream_symbols_250_unique.json',
  );
  const rawData = fs.readFileSync(filepath, 'utf-8');

  const symbols = JSON.parse(rawData);

  for (const symbol of symbols) {
    await prisma.symbol.upsert({
      where: { name: symbol.name },
      update: {},
      create: {
        name: symbol.name,
        category: symbol.category,
        description: symbol.description,
      },
    });
  }

  console.log(`Seeded ${symbols.length} symbols`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
