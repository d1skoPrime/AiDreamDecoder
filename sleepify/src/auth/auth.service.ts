import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Subscription, User } from '@prisma/client';
import { Request, Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtTokenGenerate } from './jwt.token.generate';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // Default monthly request limits for new users
  private readonly DEFAULT_FREE_REQUESTS = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtTokenGenerate: JwtTokenGenerate,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailservice: MailService,
  ) {}

  /**
   * Register a new user
   */

  /**
   * Logout user by clearing refresh token
   */
  async logout(res: Response, req: Request) {
    const refreshToken = req.cookies['refreshToken'];
    const accessToken = req.cookies['accessToken'];

    if (!refreshToken && !accessToken) {
      throw new BadRequestException('No active session found');
    }

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    this.logger.log('User logged out');

    return res.json({
      success: true,
      statusCode: 200,
      message: 'Successfully logged out',
    });
  }

  /**
   * Refresh access token using refresh token
   */
  async issueNewTokens(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
        include: { subscription: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const tokens = await this.jwtTokenGenerate.generateTokens(user);

      // Update refresh token cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return {
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      this.logger.error('Token refresh failed:', error);

      // Clear invalid refresh token
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Request password reset email
   */

  /**
   * Return safe user fields (exclude sensitive data)
   */
  private returnUserFields(user: User & { subscription: Subscription | null }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      subscription: {
        tier: user.subscription?.tier || 'FREE',
        expiresAt: user.subscription?.expiresAt || null,
      },
      requestsLeft: user.freeDreamRequestsLeft,
      lastRequestDate: user.lastRequestDate,
    };
  }

  async googleLogin(req, res: Response) {
    const google = req.user;

    let user = await this.prisma.user.findUnique({
      where: { email: google.email },
      include: { subscription: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: google.email,
          name: google.displayName,
          googleId: google.googleId,
          picture: google.picture,
          freeDreamRequestsLeft: this.DEFAULT_FREE_REQUESTS,
          subscription: {
            create: {
              tier: 'FREE',
              startedAt: new Date(),
              expiresAt: new Date('2099-12-31'),
              nextReset: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        include: {
          subscription: true,
        },
      });

      await this.mailservice.sendWelcomeEmail(user.email, user.name ?? '');
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { email: user.email },
        data: {
          googleId: google.googleId,
          picture: google.picture,
        },
        include: { subscription: true },
      });
    } else {
      user = await this.prisma.user.update({
        where: { email: user.email },
        data: {
          picture: google.picture,
          name: google.name,
        },
        include: { subscription: true },
      });
    }

    const tokens = await this.jwtTokenGenerate.generateTokens(user);

    const result = {
      ...this.returnUserFields(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    return result;
  }

  async handleGoogleLogin(googleProfile: any) {
    const { email, googleId, name, picture } = googleProfile;

    let user = await this.prisma.user.findUnique({
      where: { email },
      include: { subscription: true },
    });

    if (!user) {
      // New user
      user = await this.prisma.user.create({
        data: {
          email,
          googleId,
          name,
          picture,
          freeDreamRequestsLeft: this.DEFAULT_FREE_REQUESTS,
          subscription: {
            create: {
              tier: 'FREE',
              startedAt: new Date(),
              expiresAt: new Date('2099-12-31'),
              nextReset: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        include: { subscription: true },
      });

      await this.mailservice.sendWelcomeEmail(user.email, user.name || 'User');
    } else {
      // Existing Google user, update name/picture
      user = await this.prisma.user.update({
        where: { email: user.email },
        data: {
          googleId: user.googleId || googleProfile.googleId,
          picture: googleProfile.picture,
          name: googleProfile.name || user.name,
        },
        include: { subscription: true },
      });
    }

    // Generate tokens
    const tokens = await this.jwtTokenGenerate.generateTokens(user);

    return {
      user: this.returnUserFields(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
