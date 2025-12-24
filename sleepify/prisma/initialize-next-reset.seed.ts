import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting nextReset initialization...');

  try {
    // Get all users with subscriptions (excluding admins)
    const users = await prisma.user.findMany({
      include: { subscription: true },
      where: { role: { not: 'ADMIN' } },
    });

    let updatedCount = 0;
    let skippedCount = 0;
    let createdSubscriptions = 0;

    for (const user of users) {
      if (user.subscription) {
        // Check if nextReset is already set to a future date
        const now = new Date();
        if (user.subscription.nextReset > now) {
          console.log(
            `⏭️  Skipping ${user.email} - nextReset already set to ${user.subscription.nextReset}`,
          );
          skippedCount++;
          continue;
        }

        // Calculate nextReset as 30 days from subscription start
        const nextReset = new Date(
          user.subscription.startedAt.getTime() + 30 * 24 * 60 * 60 * 1000,
        );

        // If that date is in the past, set it to 30 days from now
        const finalNextReset =
          nextReset < now
            ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            : nextReset;

        await prisma.subscription.update({
          where: { id: user.subscription.id },
          data: { nextReset: finalNextReset },
        });

        console.log(
          `✅ Updated ${user.email} (${user.subscription.tier}): nextReset = ${finalNextReset.toISOString()}`,
        );
        updatedCount++;
      } else {
        // User has no subscription - create a FREE subscription
        const now = new Date();
        const nextReset = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

        await prisma.subscription.create({
          data: {
            userId: user.id,
            tier: 'FREE',
            isActive: true,
            startedAt: user.createdAt,
            expiresAt: expiresAt,
            nextReset: nextReset,
          },
        });

        console.log(
          `🆕 Created FREE subscription for ${user.email}: nextReset = ${nextReset.toISOString()}`,
        );
        createdSubscriptions++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   🆕 Created: ${createdSubscriptions}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📝 Total processed: ${users.length}`);
    console.log('\n✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seed execution:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
