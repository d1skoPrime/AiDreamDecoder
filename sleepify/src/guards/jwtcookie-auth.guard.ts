import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtCookieAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies['accessToken']; // Read from cookie

    if (!token) {
      throw new UnauthorizedException('No access token found');
    }

    // Inject token into headers for JwtStrategy
    // console.log('JWT Cookie Auth Guard - Token from Cookie:', token);
    req.headers.authorization = `Bearer ${token}`;

    const result = (await super.canActivate(context)) as boolean;

    // console.log(
    //   'JwtCookieAuthGuard - Authorization header set:',
    //   req.headers.authorization,
    // );

    // // await super.logIn(req); // ensures req.user is populated
    // console.log('JwtCookieAuthGuard - super.canActivate result:', result);

    return result;
  }
}
