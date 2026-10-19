import {
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema/index.js';
import { DRIZZLE_DB, MYSQL_POOL } from './database.tokens.js';

@Global()
@Module({
  providers: [
    {
      provide: MYSQL_POOL,
      useFactory: (): Pool => {
        return mysql.createPool({
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT) || 3306,
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'nest_db',
          waitForConnections: true,
          connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
          maxIdle: Number(process.env.DB_MAX_IDLE) || 10,
          idleTimeout: Number(process.env.DB_IDLE_TIMEOUT) || 60000,
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,
          ssl:
            process.env.DB_SSL === 'true'
              ? { rejectUnauthorized: false }
              : undefined,
        });
      },
    },
    {
      provide: DRIZZLE_DB,
      inject: [MYSQL_POOL],
      useFactory: (pool: Pool) => {
        return drizzle(pool, { schema, mode: 'default' });
      },
    },
  ],
  exports: [DRIZZLE_DB, MYSQL_POOL],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(_signal?: string) {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
