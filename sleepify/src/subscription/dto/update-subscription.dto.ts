import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum } from 'class-validator';
import { CreateSubscriptionDto } from './create-subscription.dto';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @IsEmail()
  email: string;

  @IsEnum(['FREE', 'BASIC', 'PREMIUM'])
  tier: 'FREE' | 'BASIC' | 'PREMIUM';
}
