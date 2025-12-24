import { IsEmail, IsString, MinLength } from 'class-validator';

export class RequestChangePasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class ResetPassword {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6, { message: 'Password must contain at least 6 characters' })
  newPassword: string;
}
