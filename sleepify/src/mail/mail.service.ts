import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      this.logger.warn(
        'SMTP credentials not configured - email service disabled',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports (like 587)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // Add these for better compatibility with Gmail
      ...(smtpPort !== 465 && {
        requireTLS: true, // Force TLS for port 587
      }),
    });

    this.logger.log('✅ Email service initialized');
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Welcome Email
  async sendWelcomeEmail(to: string, userName: string): Promise<void> {
    if (!this.isValidEmail(to)) {
      throw new BadRequestException(`Invalid email address: ${to}`);
    }

    if (!this.transporter) {
      this.logger.error('Cannot send email - SMTP not configured');
      throw new BadRequestException('Email service is not configured');
    }

    const fromEmail =
      this.configService.get<string>('FROM_EMAIL') ||
      'sleepify.dreams.app@gmail.com';
    const appName = 'SleepiFy Dream AI Decoder';

    const mailOptions = {
      from: `"${appName}" <${fromEmail}>`,
      to,
      subject: `🌙 Welcome to ${appName}!`,
      html: this.getWelcomeEmailTemplate(userName, appName),
      text: this.getWelcomeEmailText(userName, appName),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Welcome email sent to ${to}`);
      this.logger.debug(`Message ID: ${info.messageId}`);
      if (info.preview) {
        this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error(`❌ Failed to send welcome email to ${to}:`, error);
      throw new BadRequestException(
        'Failed to send email. Please try again later or contact support.',
      );
    }
  }

  // Out of Requests Email
  async sendOutOfRequestsEmail(
    to: string,
    daysUntilReset: string,
    upgradeLink: string,
  ): Promise<void> {
    if (!this.isValidEmail(to)) {
      throw new BadRequestException(`Invalid email address: ${to}`);
    }

    if (!this.transporter) {
      this.logger.error('Cannot send email - SMTP not configured');
      throw new BadRequestException('Email service is not configured');
    }

    const fromEmail =
      this.configService.get<string>('FROM_EMAIL') ||
      'sleepify.dreams.app@gmail.com';
    const appName = 'SleepiFy Dream AI Decoder';

    const mailOptions = {
      from: `"${appName}" <${fromEmail}>`,
      to,
      subject: "⚠️ You've run out of AI requests this month",
      html: this.getOutOfRequestsEmailTemplate(
        daysUntilReset,
        upgradeLink,
        appName,
      ),
      text: this.getOutOfRequestsEmailText(daysUntilReset, upgradeLink),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Out-of-requests email sent to ${to}`);
      this.logger.debug(`Message ID: ${info.messageId}`);
      if (info.preview) {
        this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to send out-of-requests email to ${to}:`,
        error,
      );
      throw new BadRequestException(
        'Failed to send email. Please try again later or contact support.',
      );
    }
  }

  // Subscription Confirmation Email
  async sendSubscriptionEmail(
    to: string,
    userName: string,
    planName: string,
    planPrice: string,
    expirationDate: string,
    features: string[],
  ): Promise<void> {
    if (!this.isValidEmail(to)) {
      throw new BadRequestException(`Invalid email address: ${to}`);
    }

    if (!this.transporter) {
      this.logger.error('Cannot send email - SMTP not configured');
      throw new BadRequestException('Email service is not configured');
    }

    const fromEmail =
      this.configService.get<string>('FROM_EMAIL') ||
      'sleepify.dreams.app@gmail.com';
    const appName = 'SleepiFy Dream AI Decoder';

    const mailOptions = {
      from: `"${appName}" <${fromEmail}>`,
      to,
      subject: `🎉 Subscription Confirmed - ${planName}`,
      html: this.getSubscriptionEmailTemplate(
        userName,
        planName,
        planPrice,
        expirationDate,
        features,
        appName,
      ),
      text: this.getSubscriptionEmailText(
        userName,
        planName,
        planPrice,
        expirationDate,
        features,
      ),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Subscription email sent to ${to}`);
      this.logger.debug(`Message ID: ${info.messageId}`);
      if (info.preview) {
        this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to send subscription email to ${to}:`,
        error,
      );
      throw new BadRequestException(
        'Failed to send email. Please try again later or contact support.',
      );
    }
  }

  // ============== EMAIL TEMPLATES ==============

  // Welcome Email Template
  private getWelcomeEmailTemplate(userName: string, appName: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${appName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header with Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🌙 Welcome to ${appName}</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                    Hi <strong>${userName}</strong>,
                  </p>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                    Welcome to <strong>${appName}</strong>! We're thrilled to have you join our community of dream explorers.
                  </p>
                  
                  <!-- Info Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0; background-color: #f8f9ff; border-left: 4px solid #667eea; border-radius: 4px;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; font-weight: bold; color: #667eea;">🎯 Getting Started</p>
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #555555;">
                          You now have access to our AI-powered dream interpretation tools. Start exploring the mysteries of your dreams today!
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Steps -->
                  <p style="margin: 30px 0 15px; font-size: 16px; font-weight: bold; color: #333333;">What's Next?</p>
                  
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <span style="display: inline-block; width: 28px; height: 28px; background-color: #667eea; color: #ffffff; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; margin-right: 12px;">1</span>
                        <span style="font-size: 15px; color: #333333;">Record your dreams in the app</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <span style="display: inline-block; width: 28px; height: 28px; background-color: #667eea; color: #ffffff; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; margin-right: 12px;">2</span>
                        <span style="font-size: 15px; color: #333333;">Get AI-powered interpretations</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0;">
                        <span style="display: inline-block; width: 28px; height: 28px; background-color: #667eea; color: #ffffff; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; margin-right: 12px;">3</span>
                        <span style="font-size: 15px; color: #333333;">Discover patterns and insights</span>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://sleepify.app/dashboard" style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Start Decoding Dreams</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #666666;">
                    If you have any questions, feel free to reach out to our support team. Sweet dreams!
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #eeeeee; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #888888;">
                    © 2025 ${appName}. All rights reserved.
                  </p>
                  <p style="margin: 10px 0 0; font-size: 12px; color: #888888;">
                    You're receiving this email because you signed up for ${appName}.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }

  private getWelcomeEmailText(userName: string, appName: string): string {
    return `
Welcome to ${appName}!

Hi ${userName},

Welcome to ${appName}! We're thrilled to have you join our community of dream explorers.

Getting Started:
You now have access to our AI-powered dream interpretation tools. Start exploring the mysteries of your dreams today!

What's Next?
1. Record your dreams in the app
2. Get AI-powered interpretations
3. Discover patterns and insights

Start decoding dreams: https://sleepify.app/dashboard

If you have any questions, feel free to reach out to our support team. Sweet dreams!

© 2025 ${appName}. All rights reserved.
You're receiving this email because you signed up for ${appName}.
    `.trim();
  }

  // Out of Requests Email Template
  private getOutOfRequestsEmailTemplate(
    resetDate: string,
    upgradeLink: string,
    appName: string,
  ): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Out of AI Requests</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header with Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">⚠️ Request Limit Reached</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                    You've reached your monthly AI request limit for <strong>${appName}</strong>.
                  </p>
                  
                  <!-- Warning Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0; background-color: #fff5f5; border-left: 4px solid #ff4c4c; border-radius: 4px;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; font-weight: bold; color: #ff4c4c;">📅 Reset Date</p>
                        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333333;">
                          ${resetDate}
                        </p>
                        <p style="margin: 10px 0 0; font-size: 13px; color: #666666;">
                          Your request limit will automatically reset on this date.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Premium Benefits -->
                  <p style="margin: 30px 0 15px; font-size: 16px; font-weight: bold; color: #333333;">Upgrade to Premium and Get:</p>
                  
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 10px 0;">
                        <span style="color: #4CAF50; font-size: 18px; margin-right: 8px;">✓</span>
                        <span style="font-size: 15px; color: #333333;">Unlimited AI dream interpretations</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0;">
                        <span style="color: #4CAF50; font-size: 18px; margin-right: 8px;">✓</span>
                        <span style="font-size: 15px; color: #333333;">Advanced dream pattern analysis</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0;">
                        <span style="color: #4CAF50; font-size: 18px; margin-right: 8px;">✓</span>
                        <span style="font-size: 15px; color: #333333;">Priority support</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0;">
                        <span style="color: #4CAF50; font-size: 18px; margin-right: 8px;">✓</span>
                        <span style="font-size: 15px; color: #333333;">Export and save all your dreams</span>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${upgradeLink}" style="display: inline-block; padding: 14px 32px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Upgrade Your Subscription</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #666666; text-align: center;">
                    Thank you for using ${appName}!
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #eeeeee; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #888888;">
                    © 2025 ${appName}. All rights reserved.
                  </p>
                  <p style="margin: 10px 0 0; font-size: 12px; color: #888888;">
                    Questions? Contact support at support@sleepify.app
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }

  private getOutOfRequestsEmailText(
    resetDate: string,
    upgradeLink: string,
  ): string {
    return `
You've reached your monthly AI request limit

You have used all your AI requests for this month in SleepiFy Dream AI Decoder.

Reset Date: ${resetDate}
Your request limit will automatically reset on this date.

Upgrade to Premium and Get:
✓ Unlimited AI dream interpretations
✓ Advanced dream pattern analysis
✓ Priority support
✓ Export and save all your dreams

Upgrade your subscription here: ${upgradeLink}

Thank you for using SleepiFy Dream AI Decoder!

Questions? Contact support at support@sleepify.app
    `.trim();
  }

  // Subscription Email Template
  private getSubscriptionEmailTemplate(
    userName: string,
    planName: string,
    planPrice: string,
    expirationDate: string,
    features: string[],
    appName: string,
  ): string {
    const featuresList = features
      .map(
        (feature) => `
      <tr>
        <td style="padding: 10px 0;">
          <span style="color: #4CAF50; font-size: 18px; margin-right: 8px;">✓</span>
          <span style="font-size: 15px; color: #333333;">${feature}</span>
        </td>
      </tr>
    `,
      )
      .join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header with Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 Subscription Confirmed!</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                    Hi <strong>${userName}</strong>,
                  </p>
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                    Thank you for subscribing to <strong>${appName}</strong>! Your subscription is now active.
                  </p>
                  
                  <!-- Subscription Details Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0; background: linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%); border-radius: 8px; border: 2px solid #667eea;">
                    <tr>
                      <td style="padding: 25px;">
                        <p style="margin: 0 0 15px; font-size: 14px; font-weight: bold; color: #667eea; text-transform: uppercase;">Subscription Details</p>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: #666666; width: 40%;">Plan:</td>
                            <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #333333;">${planName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: #666666;">Price:</td>
                            <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #333333;">${planPrice}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: #666666;">Expires:</td>
                            <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #333333;">${expirationDate}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Features -->
                  <p style="margin: 30px 0 15px; font-size: 16px; font-weight: bold; color: #333333;">What's Included:</p>
                  
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    ${featuresList}
                  </table>
                  
                  <!-- CTA Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://sleepify.app/dashboard" style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Go to Dashboard</a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Info Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0; background-color: #f8f9ff; border-left: 4px solid #667eea; border-radius: 4px;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; font-weight: bold; color: #667eea;">💳 Billing Information</p>
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #555555;">
                          You can manage your subscription, update payment methods, or cancel anytime from your account settings.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #666666;">
                    If you have any questions about your subscription, feel free to contact our support team.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #eeeeee; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #888888;">
                    © 2025 ${appName}. All rights reserved.
                  </p>
                  <p style="margin: 10px 0 0; font-size: 12px; color: #888888;">
                    Need help? Contact support at support@sleepify.app
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }

  private getSubscriptionEmailText(
    userName: string,
    planName: string,
    planPrice: string,
    expirationDate: string,
    features: string[],
  ): string {
    const featuresList = features.map((feature) => `✓ ${feature}`).join('\n');

    return `
Subscription Confirmed!

Hi ${userName},

Thank you for subscribing to SleepiFy Dream AI Decoder! Your subscription is now active.

Subscription Details:
Plan: ${planName}
Price: ${planPrice}
Expires: ${expirationDate}

What's Included:
${featuresList}

Go to Dashboard: https://sleepify.app/dashboard

Billing Information:
You can manage your subscription, update payment methods, or cancel anytime from your account settings.

If you have any questions about your subscription, feel free to contact our support team.

© 2025 SleepiFy Dream AI Decoder. All rights reserved.
Need help? Contact support at support@sleepify.app
    `.trim();
  }
}
