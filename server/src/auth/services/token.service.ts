import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const JWT_ACCESS_TOKEN_EXPIRATION_TIME = '15m';
const JWT_REFRESH_TOKEN_EXPIRATION_TIME = '7d';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(userId: string): Promise<{ accessToken: string }> {
    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(
      payload,

      {
        secret: this.configService.get<string>('AUTH_SECRET')!,
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      },
    );

    return { accessToken };
  }

  async generateRefreshToken(
    userId: string,
  ): Promise<{ refreshToken: string }> {
    const payload = { sub: userId };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('AUTH_SECRET')!,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return { refreshToken };
  }
}
