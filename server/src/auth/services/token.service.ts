import { schemas } from '@/libs/db/schemas';
import { DbTransaction } from '@/libs/shared/types/transaction.types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

const JWT_ACCESS_TOKEN_EXPIRATION_TIME = '15m';
const JWT_REFRESH_TOKEN_EXPIRATION_TIME = '7d';

@Injectable()
export class TokenService {
  constructor(
    @Inject('DRIZZLE_DB') private readonly db: NeonDatabase<typeof schemas>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private getClient(tx?: DbTransaction) {
    return tx ?? this.db;
  }

  async generateAccessToken(userId: string) {
    const payload = { sub: userId };

    const verificationToken = await this.jwtService.signAsync(
      payload,

      {
        secret: this.configService.get<string>('AUTH_SECRET')!,
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      },
    );

    return verificationToken;
  }
}
