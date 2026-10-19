import { Global, Module } from '@nestjs/common';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { BETTER_AUTH, createBetterAuth } from './auth.config.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './guards/auth.guard.js';
import { StaffGuard } from './guards/staff.guard.js';
import { AdminGuard } from './guards/admin.guard.js';
import { OptionalAuthGuard } from './guards/optional-auth.guard.js';
import { DRIZZLE_DB } from '../database/database.tokens.js';
import * as schema from '../database/schema/index.js';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: BETTER_AUTH,
      inject: [DRIZZLE_DB],
      useFactory: (db: MySql2Database<typeof schema>) => {
        return createBetterAuth(db);
      },
    },
    AuthService,
    AuthGuard,
    StaffGuard,
    AdminGuard,
    OptionalAuthGuard,
  ],
  exports: [
    BETTER_AUTH,
    AuthService,
    AuthGuard,
    StaffGuard,
    AdminGuard,
    OptionalAuthGuard,
  ],
})
export class AuthModule {}
