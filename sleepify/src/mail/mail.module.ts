import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [ConfigModule],
})
export class MailModule {}
