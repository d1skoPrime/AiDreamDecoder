import { MailModule } from '@/mail/mail.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService, ConfigService],
  imports: [ConfigModule, PrismaModule, MailModule, JwtModule.register({})],
})
export class SubscriptionModule {}
