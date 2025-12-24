import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { DreamsModule } from './dreams/dreams.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SymbolsModule } from './symbols/symbols.module';

import { ScheduleModule } from '@nestjs/schedule';
import { StripeModule } from './stripe/stripe.module';
import { TasksModule } from './tasks/tasks.module';
import { TasksService } from './tasks/tasks.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    TasksModule,
    StripeModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 0,
          limit: 0,
        },
      ],
    }),
    UserModule,
    DreamsModule,
    SymbolsModule,
    SubscriptionModule,
    AnalyticsModule,
    PrismaModule,

    MailModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    StripeModule,
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
