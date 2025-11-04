import { Body, Controller, Post, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { SigninDto } from '../dto/signin.dto';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<{
    message: string;
    data: {};
  }> {
    return await this.authService.signup(signupDto, res);
  }

  @Post('signin')
  async signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<{
    message: string;
    data: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    return await this.authService.signin(signinDto, res);
  }
}
