import { PrismaService } from '@/prisma/prisma.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { SubscriptionTier } from '@prisma/client';
import { Request } from 'express';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private prisma: PrismaService,
  ) {}

  // Create checkout session for subscription
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() body: { userId: string; priceId: string; email: string },
  ) {
    const session = await this.stripeService.createCheckoutSession(
      body.userId,
      body.priceId,
      body.email,
    );
    return { url: session.url };
  }

  // Get subscription details
  @Get('subscription/:id')
  async getSubscription(@Param('id') id: string) {
    return await this.stripeService.getSubscription(id);
  }

  // Cancel subscription
  @Delete('subscription/:subscriptionId')
  async cancelSubscription(@Param('subscriptionId') subscriptionId: string) {
    // 1. Tells Stripe to cancel (but not immediately)
    const canceledSubscription =
      await this.stripeService.cancelSubscription(subscriptionId);

    // 2. Marks as inactive in YOUR database
    await this.prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        isActive: false, // ← Marked as canceled
        // tier stays PREMIUM/BASIC until period ends
        // expiresAt stays Jan 31
      },
    });

    return {
      message:
        'Subscription canceled. Access continues until end of billing period.',
      expiresAt: 'Jan 31',
    };
  }

  // Create customer portal session
  @Post('create-portal-session')
  async createPortalSession(@Body() body: { customerId: string }) {
    const session = await this.stripeService.createPortalSession(
      body.customerId,
    );
    return { url: session.url };
  }

  // Get checkout session details
  @Get('checkout-session/:id')
  async getCheckoutSession(@Param('id') id: string) {
    const session = await this.stripeService.getCheckoutSession(id);

    const userId = session.metadata?.userId;
    if (!userId) return session;

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    return { session, subscription };
  }

  // List all available prices
  @Get('prices')
  async listPrices() {
    return await this.stripeService.listPrices();
  }

  // Webhook endpoint - handles Stripe events
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    // Get raw body
    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new Error('No raw body found on request');
    }

    console.log('🔍 Raw body type:', typeof rawBody);
    console.log('🔍 Raw body is Buffer?', Buffer.isBuffer(rawBody));

    const event = this.stripeService.constructWebhookEvent(rawBody, signature);

    console.log(`📨 Received webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as any;
        console.log('✅ Checkout completed:', session.id);

        const userId = session.metadata?.userId;
        const stripeCustomerId = session.customer;

        if (!userId) {
          console.log('⚠️ No userId in metadata');
          break;
        }

        try {
          // 1. Link Stripe customer to user
          if (stripeCustomerId) {
            await this.prisma.user.update({
              where: { id: userId },
              data: { stripeCustomerId },
            });
            console.log(`✅ Customer ${stripeCustomerId} → User ${userId}`);
          }

          // 2. Fetch full session with line items
          console.log('🔍 Fetching full session...');
          const fullSession = await this.stripeService.getCheckoutSession(
            session.id,
          );

          // 3. Extract price ID
          const priceId = fullSession.line_items?.data?.[0]?.price?.id;
          console.log('💰 Price ID:', priceId);

          if (!priceId) {
            console.error('❌ No price ID found');
            break;
          }

          // 4. Determine tier and limits
          let tier: SubscriptionTier = SubscriptionTier.FREE;

          if (priceId === 'price_1SZOQICOYz6viehWkr64Egke') {
            tier = SubscriptionTier.BASIC;
          } else if (priceId === 'price_1SZOR5COYz6viehWiPMc4uj2') {
            tier = SubscriptionTier.PREMIUM;
          }

          // 5. Update subscription
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          const nextReset = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Reset in 30 days

          await this.prisma.subscription.update({
            where: { userId },
            data: {
              tier,
              expiresAt,
              isActive: true,
              nextReset, // ← Update next reset time
            },
          });

          // 6. Reset user's request counters ← THIS IS THE KEY FIX!
          await this.resetUserLimits(userId, tier);

          console.log(`✅ User ${userId} upgraded to ${tier}`);
        } catch (error) {
          console.error('❌ Error:', error);
        }
        break;

      case 'customer.subscription.created':
        const newSubscription = event.data.object as any;
        console.log('✅ Subscription created:', newSubscription.id);
        // TODO: Create subscription record in database
        break;

      case 'customer.subscription.updated':
        const updatedSub = event.data.object as any;
        console.log('🔄 Subscription updated:', updatedSub.id);

        const stripeCustomer = updatedSub.customer;

        const user = await this.prisma.user.findUnique({
          where: { stripeCustomerId: stripeCustomer },
        });

        if (!user) {
          console.log('⚠️ No user found');
          break;
        }

        const subPriceId = updatedSub.items.data[0].price.id;
        let subTier: SubscriptionTier = SubscriptionTier.FREE;

        if (subPriceId === 'price_1SZOQICOYz6viehWkr64Egke') {
          subTier = SubscriptionTier.BASIC;
        } else if (subPriceId === 'price_1SZOR5COYz6viehWiPMc4uj2') {
          subTier = SubscriptionTier.PREMIUM;
        }

        // Update subscription tier
        await this.prisma.subscription.update({
          where: { userId: user.id },
          data: { tier: subTier },
        });

        // Reset user limits for new tier ← ADD THIS
        await this.resetUserLimits(user.id, subTier);

        console.log(`✅ User ${user.id} → ${subTier}`);
        break;

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as any;
        console.log('❌ Subscription deleted:', deletedSub.id);

        const deletedCustomer = deletedSub.customer;
        const deletedUser = await this.prisma.user.findUnique({
          where: { stripeCustomerId: deletedCustomer },
        });

        if (deletedUser) {
          // Downgrade to FREE
          await this.prisma.subscription.update({
            where: { userId: deletedUser.id },
            data: {
              tier: SubscriptionTier.FREE,
              isActive: false,
              stripeSubscriptionId: null,
            },
          });

          // Reset to FREE tier limits ← ADD THIS
          await this.resetUserLimits(deletedUser.id, SubscriptionTier.FREE);

          console.log(`✅ User ${deletedUser.id} → FREE`);
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as any;
        console.log('💰 Payment succeeded:', invoice.id);
        // TODO: Extend subscription period
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as any;
        console.log('⚠️ Payment failed:', failedInvoice.id);
        // TODO: Notify user about failed payment
        // await this.emailService.sendPaymentFailedEmail(failedInvoice.customer_email);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async resetUserLimits(userId: string, tier: SubscriptionTier) {
    // Define limits per tier
    const limits = {
      [SubscriptionTier.FREE]: 2,
      [SubscriptionTier.BASIC]: 40,
      [SubscriptionTier.PREMIUM]: 450, // Unlimited
    };

    const requestLimit = limits[tier];

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        dailyRequestCount: 0,
        freeDreamRequestsLeft: requestLimit,
        lastRequestDate: new Date(),
      },
    });

    console.log(`🔄 User ${userId} limits reset: ${requestLimit} requests`);
  }

  @Get('success')
  async success(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      return { error: 'Missing session_id' };
    }

    try {
      // Retrieve the session from Stripe
      const session = await this.stripeService.getCheckoutSession(sessionId);

      // Optional: check payment status
      if (session.payment_status !== 'paid') {
        return { error: 'Payment not completed' };
      }

      // Optional: you can also verify metadata like userId
      const userId = session.metadata?.userId;
      if (!userId) return { error: 'No userId in session metadata' };

      // Fetch subscription from DB
      const subscription = await this.prisma.subscription.findUnique({
        where: { userId },
      });

      return {
        message: 'Payment successful ✅',
        sessionId,
        userId,
        subscription,
        amount_total: session.amount_total,
        currency: session.currency,
      };
    } catch (error) {
      console.error('❌ Invalid Stripe session:', error);
      return { error: 'Invalid session_id' };
    }
  }
}
