import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService], // Export so other modules can use StripeService
})
export class StripeModule {}
