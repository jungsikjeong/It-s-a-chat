import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(private configService: ConfigService) {
    const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET');

    if (!refreshSecret) {
      throw new Error(
        'JWT_REFRESH_SECRET 환경 변수가 설정되지 않았습니다. JWT Refresh Token을 위해 이 환경 변수를 설정하세요.',
      );
    }

    super({
      jwtFromRequest: (req) => {
        return req?.cookies?.refreshToken || null;
      },
      secretOrKey: refreshSecret,
      passReqToCallback: true,
      ignoreExpiration: true,
    });
  }

  async validate(req: any, payload: { sub: string; scopes: string[] }) {
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('refresh token not found');
    }

    return {
      sub: payload.sub,
      scopes: payload.scopes,
    };
  }
}
