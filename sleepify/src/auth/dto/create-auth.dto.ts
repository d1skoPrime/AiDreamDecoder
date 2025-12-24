import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsString({ message: 'Name must be a string' })
  name: string;
}

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
