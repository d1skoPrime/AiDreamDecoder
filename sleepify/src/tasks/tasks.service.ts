import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionTier } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  // Helper function to get limits per tier
  private getTierLimits(tier: SubscriptionTier): number {
    const limits = {
      [SubscriptionTier.FREE]: 2,
      [SubscriptionTier.BASIC]: 40,
      [SubscriptionTier.PREMIUM]: 999999,
    };
    return limits[tier];
  }

  // Helper function to reset user limits
  private async resetUserLimits(userId: string, tier: SubscriptionTier) {
    const requestLimit = this.getTierLimits(tier);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        dailyRequestCount: 0,
        freeDreamRequestsLeft: requestLimit,
        lastRequestDate: new Date(),
      },
    });

    this.logger.log(`🔄 User ${userId} limits reset to ${requestLimit}`);
  }

  // Run every day at midnight (00:00)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetMonthlyLimits() {
    this.logger.log('🔍 Checking for subscriptions to reset...');

    const now = new Date();

    // Find all active subscriptions that need reset
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        isActive: true,
        nextReset: {
          lte: now, // nextReset date has passed
        },
      },
      include: {
        user: true,
      },
    });

    this.logger.log(`📊 Found ${subscriptions.length} subscriptions to reset`);

    for (const subscription of subscriptions) {
      try {
        // Check if already reset today
        const lastReset = subscription.user.lastRequestDate;
        const today = new Date().toDateString();

        if (lastReset && new Date(lastReset).toDateString() === today) {
          this.logger.log(`⏭️ User ${subscription.userId} already reset today`);
          continue; // Skip this user, move to next
        }
        // Reset user limits
        await this.resetUserLimits(subscription.userId, subscription.tier);

        // Update next reset date (30 days from now)
        const nextReset = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { nextReset },
        });

        this.logger.log(`✅ Monthly reset for user ${subscription.userId}`);
      } catch (error) {
        this.logger.error(
          `❌ Error resetting user ${subscription.userId}:`,
          error,
        );
      }
    }

    this.logger.log('✅ Monthly reset completed');
  }

  // Optional: Run every hour to check for expired subscriptions
  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredSubscriptions() {
    this.logger.log('🔍 Checking for expired subscriptions...');

    const now = new Date();

    const expiredSubscriptions = await this.prisma.subscription.findMany({
      where: {
        isActive: true,
        expiresAt: {
          lte: now, // Subscription has expired
        },
      },
    });

    this.logger.log(
      `📊 Found ${expiredSubscriptions.length} expired subscriptions`,
    );

    for (const subscription of expiredSubscriptions) {
      try {
        // Downgrade to FREE
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            tier: SubscriptionTier.FREE,
            isActive: false,
          },
        });

        // Reset to FREE limits
        await this.resetUserLimits(subscription.userId, SubscriptionTier.FREE);

        this.logger.log(
          `✅ User ${subscription.userId} downgraded to FREE (expired)`,
        );
      } catch (error) {
        this.logger.error(
          `❌ Error downgrading user ${subscription.userId}:`,
          error,
        );
      }
    }
  }

  // Manual trigger endpoint (for testing)
  async manualResetMonthlyLimits() {
    this.logger.log('🔧 Manual monthly reset triggered');
    await this.resetMonthlyLimits();
  }
}
