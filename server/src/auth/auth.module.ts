import { DatabaseModule } from '@/libs/db/db.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { UserCheckService } from './services/user-check.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    DatabaseModule,

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET!,
    }),
    TokenService,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserCheckService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
