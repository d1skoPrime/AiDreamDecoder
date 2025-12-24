import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';

@Module({
  controllers: [SymbolsController],
  providers: [SymbolsService, PrismaService],
  imports: [ConfigModule, PrismaModule, JwtModule.register({})],
})
export class SymbolsModule {}
