import { PartialType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  email: string;
  @IsEnum(Role)
  role: Role;
}
