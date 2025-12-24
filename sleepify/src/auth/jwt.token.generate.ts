import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenGenerate {
  constructor(private jwtService: JwtService) {}

  async generateTokens(user: { id: string; email: string; role: string }) {
    const secret = process.env.JWT_SECRET;
    const refSecret = process.env.JWT_REFRESH_SECRET;

    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
      },
      {
        expiresIn: '30m',
        secret: secret,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: 'refresh',
      },
      {
        expiresIn: '7d',
        secret: refSecret,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
