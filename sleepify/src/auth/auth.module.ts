import { JwtStrategy } from '@/strategy/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleStrategy } from 'src/strategy/google.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtTokenGenerate } from './jwt.token.generate';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenGenerate,
    PrismaService,
    GoogleStrategy,
    JwtStrategy,
  ],
  imports: [
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
  ],
})
export class AuthModule {}
