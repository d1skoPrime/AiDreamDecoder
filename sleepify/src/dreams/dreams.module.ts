import { AiGuardService } from '@/guards/ai-security.guard';
import { MailModule } from '@/mail/mail.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { DreamsController } from './dreams.controller';
import { DreamsService } from './dreams.service';

@Module({
  controllers: [DreamsController],
  providers: [DreamsService, PrismaService, AiGuardService],
  imports: [
    JwtModule.register({}),
    ConfigModule,
    PrismaModule,
    MailModule,
    ScheduleModule.forRoot(),
  ],
})
export class DreamsModule {}
