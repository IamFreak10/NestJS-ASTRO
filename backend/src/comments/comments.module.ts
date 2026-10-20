import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import {
  CommentsController,
  ComplaintCommentsController,
} from './comments.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CommentsController, ComplaintCommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}

