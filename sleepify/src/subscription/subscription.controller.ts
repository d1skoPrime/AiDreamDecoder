import { JwtCookieAuthGuard } from '@/guards/jwtcookie-auth.guard';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RoleCheckGuard } from 'src/guards/role.check.guard';
import { Roles } from 'src/guards/role.user.decorator';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('status')
  @UseGuards(JwtCookieAuthGuard)
  async getSubscriptionStatus(@Req() req: Request) {
    return this.subscriptionService.getSubscriptionStatus(req);
  }

  @Post('premium/subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribeToPremium(@Req() req: Request) {
    return this.subscriptionService.subscribeToPremium(req);
  }

  @Patch('grant')
  @Roles('ADMIN')
  @UseGuards(JwtCookieAuthGuard, RoleCheckGuard)
  async grantSubscription(
    @Body() dto: UpdateSubscriptionDto,
    @Req() req: Request,
  ) {
    return this.subscriptionService.grantSubscription(dto, req);
  }
}
