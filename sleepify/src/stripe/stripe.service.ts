import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2025-11-17.clover',
      },
    );
  }

  // ← ADD THE METHOD HERE (after constructor)
  async createCheckoutSession(
    userId: string,
    priceId: string,
    email: string,
  ): Promise<Stripe.Checkout.Session> {
    const successUrl = `${this.configService.get('FRONTEND_URL')}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${this.configService.get('FRONTEND_URL')}/cancel`;

    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId },
    });
  }

  // Get subscription details
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  // Cancel subscription
  async cancelSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.cancel(subscriptionId);
  }

  // Create customer portal session
  async createPortalSession(
    customerId: string,
  ): Promise<Stripe.BillingPortal.Session> {
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${this.configService.get('FRONTEND_URL')}/profile`,
    });
  }

  // Get checkout session
  async getCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
  }

  // List all prices
  async listPrices(): Promise<Stripe.ApiList<Stripe.Price>> {
    return await this.stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });
  }

  // Construct webhook event (for webhook verification)
  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    )!;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    console.log('🔍 Webhook payload type:', typeof payload);
    console.log('🔍 Webhook payload is Buffer?', Buffer.isBuffer(payload));
    console.log(
      '🔑 Using webhook secret:',
      webhookSecret.substring(0, 10) + '...',
    );

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}
