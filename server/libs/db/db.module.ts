import { Module } from '@nestjs/common';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { config } from 'dotenv';
import ws from 'ws';

config({ path: '.env' });

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

@Module({
  providers: [
    { provide: 'NEON_POOL', useValue: pool },
    { provide: 'DRIZZLE_DB', useValue: db },
  ],
  exports: ['NEON_POOL', 'DRIZZLE_DB'],
})
export class DatabaseModule {}
