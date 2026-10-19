import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ComplaintsModule } from './complaints/complaints.module.js';
import { TicketsModule } from './tickets/tickets.module.js';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ComplaintsModule,
    TicketsModule,
  ],
})
export class AppModule {}
