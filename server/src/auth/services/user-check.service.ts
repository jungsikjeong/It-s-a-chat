import { DbTransaction } from '@/libs/shared/types/transaction.types';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { schemas, tables } from 'libs/db/schemas';

@Injectable()
export class UserCheckService {
  constructor(
    @Inject('DRIZZLE_DB') private readonly db: NeonDatabase<typeof schemas>,
  ) {}

  private getClient(tx?: DbTransaction) {
    return tx ?? this.db;
  }

  async isNicknameAvailable(
    nickname: string,
    tx?: DbTransaction,
  ): Promise<boolean> {
    const [user] = await this.getClient(tx)
      .select()
      .from(tables.users)
      .where(eq(tables.users.nickname, nickname));

    return !!user;
  }

  async findUserByLoginId(loginId: string, tx?: DbTransaction) {
    const [user] = await this.getClient(tx)
      .select()
      .from(tables.users)
      .where(eq(tables.users.loginId, loginId));

    return user;
  }
}
