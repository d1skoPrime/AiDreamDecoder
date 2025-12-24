import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  // Monthly limits per tier (must match DreamsService)
  private readonly LIMITS = {
    FREE: 5,
    BASIC: 40,
    PREMIUM: 450,
  } as const;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configS: ConfigService,
  ) {}

  /**
   * Get user's current subscription status and remaining requests
   * This method is READ-ONLY and doesn't reset limits (that's done by cron)
   */
  async getSubscriptionStatus(req: Request) {
    const userData = req['user'];
    const userId = userData?.sub;

    if (!userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription: {
          select: {
            tier: true,
            startedAt: true,
            expiresAt: true,
          },
        },
        freeDreamRequestsLeft: true,
        lastRequestDate: true,
        createdAt: true,
        role: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // ADMIN has unlimited requests
    if (user.role === 'ADMIN') {
      return {
        subscription: 'ADMIN',
        tier: 'ADMIN',
        freeDreamRequestsLeft: 'unlimited',
        monthlyLimit: 'unlimited',
        nextResetDate: null,
        subscriptionExpiry: null,
      };
    }

    const tier = user.subscription?.tier || 'FREE';
    const monthlyLimit = this.LIMITS[tier];

    // Calculate next reset date (1st of next month)
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const nextReset = new Date(now);
    nextReset.setMonth(nextReset.getMonth() + 1);

    return {
      tier,
      freeDreamRequestsLeft: user.freeDreamRequestsLeft,
      monthlyLimit,
      nextResetDate: nextReset.toISOString(),
      subscriptionExpiry: user.subscription?.expiresAt?.toISOString() || null,
      subscriptionActive: user.subscription?.expiresAt
        ? new Date(user.subscription.expiresAt) > now
        : false,
    };
  }

  /**
   * Grant or update a user's subscription (ADMIN only)
   * This immediately resets their request count to the new tier's limit
   */
  async grantSubscription(dto: UpdateSubscriptionDto, req: Request) {
    const userData = req['user'];
    const adminId = userData?.sub;

    if (!adminId) {
      throw new BadRequestException('Invalid authentication token');
    }

    // Verify admin permissions
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new BadRequestException('Unauthorized: Admin access required');
    }

    const { email, tier: newTier } = dto;

    // Validate tier
    if (!['FREE', 'BASIC', 'PREMIUM'].includes(newTier)) {
      throw new BadRequestException(
        'Invalid subscription tier. Must be FREE, BASIC, or PREMIUM',
      );
    }

    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const nextReset = new Date(now);
    nextReset.setMonth(nextReset.getMonth() + 1);

    // Use transaction for atomic update
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Check if user exists
        const targetUser = await tx.user.findUnique({
          where: { email },
          include: { subscription: true },
        });

        if (!targetUser) {
          throw new BadRequestException(`User with email ${email} not found`);
        }

        const newLimit = this.LIMITS[newTier];
        const now = new Date();
        const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Update or create subscription
        let updatedUser;
        if (targetUser.subscription) {
          // Update existing subscription
          updatedUser = await tx.user.update({
            where: { email },
            data: {
              subscription: {
                update: {
                  tier: newTier,
                  startedAt: now,
                  expiresAt: expiryDate,
                  nextReset,
                },
              },
              freeDreamRequestsLeft: this.LIMITS[newTier],
              lastRequestDate: now,
            },
          });
        } else {
          // Create new subscription
          updatedUser = await tx.user.update({
            where: { email },
            data: {
              subscription: {
                create: {
                  tier: newTier,
                  startedAt: now,
                  expiresAt: expiryDate,
                  nextReset,
                },
              },
              freeDreamRequestsLeft: this.LIMITS[newTier],
              lastRequestDate: now,
            },
          });
        }

        // After subscription upgrade
        // If you have a mail service, inject it (e.g. mailService) and send a notification here.
        // Example:
        // await this.mailService.sendSubscriptionEmail(targetUser.email, newTier, updatedUser.subscription?.expiresAt);
        // No mail service is available on this service currently, so skip sending an email.

        return updatedUser;
      });

      this.logger.log(
        `Admin ${adminId} granted ${newTier} subscription to user ${email}`,
      );

      return {
        success: true,
        message: `Successfully granted ${newTier} subscription`,
        user: {
          email: result.email,
          tier: result.subscription?.tier,
          requestsLeft: result.freeDreamRequestsLeft,
          monthlyLimit: this.LIMITS[newTier],
          expiresAt: result.subscription?.expiresAt,
        },
      };
    } catch (error) {
      this.logger.error('Failed to grant subscription:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Failed to update subscription. Please try again.',
      );
    }
  }

  /**
   * User initiates premium subscription (payment gateway integration point)
   */
  async subscribeToPremium(req: Request) {
    const userData = req['user'];
    const userId = userData?.sub;

    if (!userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if already premium
    if (user.subscription?.tier === 'PREMIUM') {
      const expiresAt = user.subscription.expiresAt;
      const isActive = expiresAt && new Date(expiresAt) > new Date();

      if (isActive) {
        throw new BadRequestException(
          `You already have an active Premium subscription until ${new Date(expiresAt).toLocaleDateString()}`,
        );
      }
    }

    // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
    // For now, this is a placeholder that creates the subscription
    // In production, this would:
    // 1. Create a payment intent
    // 2. Return payment URL/session
    // 3. Handle webhook to actually create subscription after payment

    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    try {
      const updatedUser = await this.prisma.$transaction(async (tx) => {
        if (user.subscription) {
          // Update existing subscription
          return await tx.user.update({
            where: { id: userId },
            data: {
              subscription: {
                update: {
                  tier: 'PREMIUM',
                  startedAt: now,
                  expiresAt: expiryDate,
                },
              },
              freeDreamRequestsLeft: this.LIMITS.PREMIUM,
            },
            include: { subscription: true },
          });
        } else {
          // Create new subscription
          return await tx.user.update({
            where: { id: userId },
            data: {
              subscription: {
                create: {
                  tier: 'PREMIUM',
                  startedAt: now,
                  expiresAt: expiryDate,
                },
              },
              freeDreamRequestsLeft: this.LIMITS.PREMIUM,
            },
            include: { subscription: true },
          });
        }
      });

      this.logger.log(`User ${userId} subscribed to PREMIUM`);

      return {
        success: true,
        message: 'Successfully subscribed to Premium',
        subscription: {
          tier: updatedUser.subscription?.tier,
          startedAt: updatedUser.subscription?.startedAt,
          expiresAt: updatedUser.subscription?.expiresAt,
          monthlyRequests: this.LIMITS.PREMIUM,
          requestsLeft: updatedUser.freeDreamRequestsLeft,
        },
      };
    } catch (error) {
      this.logger.error('Failed to create premium subscription:', error);
      throw new BadRequestException('Failed to process subscription');
    }
  }

  /**
   * Cancel user's subscription (revert to FREE tier)
   */
  async cancelSubscription(req: Request) {
    const userData = req['user'];
    const userId = userData?.sub;

    if (!userId) {
      throw new BadRequestException('Invalid authentication token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.subscription || user.subscription.tier === 'FREE') {
      throw new BadRequestException('No active subscription to cancel');
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          subscription: {
            update: {
              tier: 'FREE',
              expiresAt: new Date(), // Expire immediately
            },
          },
          freeDreamRequestsLeft: this.LIMITS.FREE,
        },
        include: { subscription: true },
      });

      this.logger.log(`User ${userId} cancelled subscription`);

      return {
        success: true,
        message: 'Subscription cancelled. Reverted to FREE tier.',
        newTier: 'FREE',
        monthlyRequests: this.LIMITS.FREE,
        requestsLeft: updatedUser.freeDreamRequestsLeft,
      };
    } catch (error) {
      this.logger.error('Failed to cancel subscription:', error);
      throw new BadRequestException('Failed to cancel subscription');
    }
  }
}
