import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
