import type { JwtModuleOptions } from '@nestjs/jwt';

export const JWTConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
};
