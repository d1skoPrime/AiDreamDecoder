import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenGenerate } from 'src/auth/jwt.token.generate';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtTokenGenerate],
  imports: [ConfigModule, PrismaModule, JwtModule.register({})],
})
export class UserModule {}
