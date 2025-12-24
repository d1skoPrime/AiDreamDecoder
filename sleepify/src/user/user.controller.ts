import { JwtCookieAuthGuard } from '@/guards/jwtcookie-auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RoleCheckGuard } from 'src/guards/role.check.guard';
import { Roles } from 'src/guards/role.user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

// Extend Express Request interface to include 'user'
declare module 'express' {
  interface Request {
    user?: any;
  }
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Grant or update user role - ADMIN ONLY
   */
  @Patch('role')
  @Roles('ADMIN')
  @UseGuards(JwtCookieAuthGuard, RoleCheckGuard)
  async GrantNewRole(
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user;

    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }

    return this.userService.GrantUserRole(
      dto,
      currentUser.sub,
      currentUser.email,
      res,
    );
  }

  /**
   * ✅ SECURED: Get user data by email
   * - Users can only query their own data
   * - Admins can query anyone's data
   */
  @UseGuards(JwtCookieAuthGuard)
  @Get('data')
  async getUserDataByEmail(@Query('email') email: string, @Req() req: Request) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const currentUser = req.user;

    // ✅ SECURITY CHECK: Users can only access their own data unless they're an admin
    if (currentUser.email !== email && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Access denied: You can only access your own data',
      );
    }

    return this.userService.getUserDataByEmail(email);
  }

  /**
   * ✅ RECOMMENDED: Simpler endpoint for users to get their own data
   * No email parameter needed - uses JWT token
   */
  @UseGuards(JwtCookieAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const currentUser = req.user;
    return this.userService.getUserDataByEmail(currentUser.email);
  }

  /**
   * ✅ NEW: Admin-only endpoint to list all users
   * Useful for admin dashboards
   */
  @UseGuards(JwtCookieAuthGuard, RoleCheckGuard)
  @Roles('ADMIN')
  @Get('all')
  async getAllUsers(@Req() req: Request) {
    return this.userService.getAllUsers();
  }

  /**
   * ✅ FIXED: Authorization check endpoint
   * Now properly fetches full user data from database
   */
  @UseGuards(JwtCookieAuthGuard)
  @Get('/authorized')
  async authorized(@Req() req: Request) {
    const currentUser = req.user; // JWT payload: {sub, email, role}

    if (!currentUser || !currentUser.email) {
      throw new BadRequestException('Invalid token or user not found');
    }

    // ✅ Fetch full user data from database
    const userData = await this.userService.getUserDataByEmail(
      currentUser.email,
    );

    return {
      returnCode: 200,
      message: 'Authorized',
      user: userData, // ✅ Return full user object with subscription, etc.
    };
  }
}
