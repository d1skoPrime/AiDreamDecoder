import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, Subscription, User } from '@prisma/client';
import { Response } from 'express';
import { JwtTokenGenerate } from 'src/auth/jwt.token.generate';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private JwtTokenGenerate: JwtTokenGenerate,
    private configS: ConfigService,
  ) {}

  /**
   * Grant or update user role
   * Only accessible by ADMIN users (enforced by controller guards)
   */
  async GrantUserRole(
    dto: UpdateUserDto,
    currentUserId: string,
    currentUserEmail: string,
    res: Response,
  ) {
    // Validate the role being assigned
    if (!Object.values(Role).includes(dto.role as Role)) {
      throw new BadRequestException(`Invalid role: ${dto.role}`);
    }

    // Find the target user
    const targetUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { subscription: true },
    });

    if (!targetUser) {
      throw new BadRequestException('User not found!');
    }

    // SECURITY: Prevent self-demotion
    if (targetUser.id === currentUserId && dto.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You cannot remove your own admin privileges. Ask another admin.',
      );
    }

    // AUDIT LOG: Track who made the change
    console.log(
      `[AUDIT] Admin ${currentUserEmail} (${currentUserId}) changing role of ` +
        `${targetUser.email} from ${targetUser.role} to ${dto.role}`,
    );

    try {
      const updatedUser = await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          role: dto.role as Role,
          freeDreamRequestsLeft:
            dto.role === 'ADMIN'
              ? 99999999
              : this.getDefaultLimitBasedOnSubscription(targetUser),
        },
        include: {
          subscription: true,
        },
      });

      // Only regenerate tokens if the admin is updating THEMSELVES
      if (targetUser.id === currentUserId) {
        const tokens = await this.JwtTokenGenerate.generateTokens(updatedUser);

        res.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: this.configS.get('NODE_ENV') === 'production',
          sameSite: 'strict',
          maxAge: this.configS.get('COOKIE_MAXAGE'),
          path: '/',
        });

        res.cookie('accessToken', tokens.accessToken, {
          httpOnly: true,
          secure: this.configS.get('NODE_ENV') === 'production',
          sameSite: 'strict',
          maxAge: this.configS.get('COOKIE_MAXAGE'),
          path: '/',
        });
      }

      return res.status(200).json({
        message: 'Role updated successfully',
        targetUser: this.returnUserFields(updatedUser),
        ...(targetUser.id === currentUserId && {
          note: 'Your tokens have been refreshed',
        }),
      });
    } catch (error) {
      console.error('[ERROR] Failed to update user role:', error);
      throw new BadRequestException('Failed to update user role');
    }
  }

  /**
   * Get user data by email
   * Access control is handled by the controller:
   * - Users can only query their own email
   * - Admins can query any email
   */
  async getUserDataByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: { subscription: true },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const result = this.returnUserFields(user);

    return result;
  }

  /**
   * ✅ NEW: Get all users - ADMIN ONLY
   * Useful for admin dashboards to manage users
   */
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: { subscription: true },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.returnUserFields(user));
  }

  /**
   * Format user data for API responses
   * Excludes sensitive fields like password
   */
  public returnUserFields(user: User & { subscription: Subscription | null }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      stripeCustomerId: user.stripeCustomerId,
      createdAt: user.createdAt,
      subscription: {
        tier: user.subscription?.tier || 'FREE',
        expiresAt: user.subscription?.expiresAt || null,
        nextReset: user.subscription?.nextReset || null,
      },
      requestsLeft: user.freeDreamRequestsLeft,
      lastRequestDate: user.lastRequestDate,
    };
  }

  /**
   * Calculate default request limit based on subscription tier
   */
  private getDefaultLimitBasedOnSubscription(
    user: User & { subscription: Subscription | null },
  ): number {
    if (!user.subscription) {
      return 5;
    }

    const tier = user.subscription.tier;
    switch (tier) {
      case 'FREE':
        return 5;
      case 'BASIC':
        return 40;
      case 'PREMIUM':
        return 450;
      default:
        return 5;
    }
  }
}
