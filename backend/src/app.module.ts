import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { TicketsModule } from './tickets/tickets.module.js';

@Module({
  imports: [
    DatabaseModule,
    TicketsModule,
  ],
})
export class AppModule {}
