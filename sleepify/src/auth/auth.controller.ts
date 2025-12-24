import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get('google/login')
  // @UseGuards(GoogleAuthGuard)
  // async googleAuth(@Req() req, @Res({ passthrough: true }) res: Response) {
  //   // This route will redirect to Google's login page
  //   console.log('GOOGLE CALLBACK req.user:', req.user);

  //   return this.authService.googleLogin(req, res);
  // }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Passport handles the redirect automatically
  }

  // @Get('google/callback')
  // @UseGuards(GoogleAuthGuard)
  // async googleAuthRedirect(@Req() req, @Res() res: Response) {
  //   const result = await this.authService.googleLogin(req, res);
  //   console.log('GOOGLE CALLBACK req.user:', req.user);

  //   res.cookie('refreshToken', result.refreshToken, {
  //     httpOnly: true,
  //     secure: false, //secure: process.env.NODE_ENV === 'production',
  //     sameSite: 'lax', // Just for Development !!!
  //     maxAge: 7 * 24 * 60 * 60 * 1000,
  //     path: '/',
  //   });

  //   res.cookie('accessToken', result.accessToken, {
  //     httpOnly: true,
  //     secure: false, //secure: process.env.NODE_ENV === 'production',
  //     sameSite: 'lax', // Just for Development !!!
  //     maxAge: 15 * 60 * 1000,
  //     path: '/',
  //   });

  //   return res.redirect(`${process.env.FRONTEND_URL_OAUTH_DEV}`);
  // }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const profile = req.user;

    if (!profile) {
      return res.status(400).send('Google login failed');
    }

    const result = await this.authService.handleGoogleLogin(profile);
    console.log(result);

    // Set cookies
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    console.log(
      `Refresh Token ${result.refreshToken} + accessToken ${result.accessToken}`,
    );

    // Redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL_OAUTH_DEV}`);
  }

  @Post('logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    return this.authService.logout(res, req);
  }
  // @Post('signup')
  // async createUser(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.createUser(createAuthDto);
  // }

  // @Post('login')
  // async loginUser(
  //   @Body() LoginAuthDto: LoginAuthDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return this.authService.loginUser(LoginAuthDto, res);

  //   // Return user and access token in response body
  // }

  @Post('refresh')
  async UpdateTokens(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    return await this.authService.issueNewTokens(refreshToken, res);
  }

  // @Post('requestpassword-reset')
  // async passwordReset(@Body() dto: RequestChangePasswordDto) {
  //   return this.authService.requestResetPassword(dto);
  //
  // }

  // @Patch('reset-password')
  // async resetPassword(@Body() dto: ResetPassword) {
  //   return this.authService.resetPassword(dto);
  // }
}
