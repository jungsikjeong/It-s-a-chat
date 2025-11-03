import { schemas, tables } from '@/libs/db/schemas';
import { DbTransaction } from '@/libs/shared/types/transaction.types';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { hash } from 'crypto';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { SigninDto } from '../dto/signin.dto';
import { SignupDto } from '../dto/signup.dto';
import {
  InvalidPasswordException,
  NicknameAlreadyInUseException,
  UserNotFoundException,
} from '../exceptions/auth.exception';
import { UserCheckService } from './user-check.service';

export class AuthService {
  constructor(
    @Inject('DRIZZLE_DB') private readonly db: NeonDatabase<typeof schemas>,
    private readonly userCheckService: UserCheckService,
  ) {}

  private getClient(tx?: DbTransaction) {
    return tx ?? this.db;
  }

  async signup(signupDto: SignupDto, tx?: DbTransaction) {
    const client = this.getClient(tx);

    const isNicknameAvailable = await this.userCheckService.isNicknameAvailable(
      signupDto.nickname,
      tx,
    );

    if (!isNicknameAvailable) {
      throw new NicknameAlreadyInUseException('이미 사용중인 닉네임입니다.');
    }

    const hashedPassword = await hash('sha256', signupDto.password);

    const user = await client
      .insert(tables.users)
      .values({ ...signupDto, password: hashedPassword })
      .returning();

    return user;
  }

  async signin(signinDto: SigninDto, tx?: DbTransaction) {
    const client = this.getClient(tx);

    const user = await this.userCheckService.findUserByLoginId(
      signinDto.loginId,
      tx,
    );

    if (!user) throw new UserNotFoundException('존재하지 않는 사용자입니다.');

    const isPasswordValid = await bcrypt.compare(
      signinDto.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new InvalidPasswordException('비밀번호가 일치하지 않습니다.');
  }
}
