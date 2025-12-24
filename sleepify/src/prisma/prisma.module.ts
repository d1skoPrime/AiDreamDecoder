import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService so it can be used in other modules
})
export class PrismaModule {}
