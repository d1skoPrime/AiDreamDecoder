import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_URIREDIRECT');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing required Google OAuth configuration');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { displayName, emails, photos, id } = profile;
    if (!emails || emails.length === 0) {
      return done(new Error('No email found in Google profile'));
    }

    const user = {
      googleId: id,
      email: emails[0].value,
      name:
        profile.displayName ||
        `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
      picture:
        photos?.[0]?.value ||
        `${profile.name?.givenName} ${profile.name?.familyName}`,
      accessToken,
    };

    done(null, user);
  }
}
