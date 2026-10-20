import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { AuthGuard, CurrentUser } from '../auth/guards/auth.guard.js';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Direct comment submission with complaintId in body
   */
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!dto.complaintId) {
      throw new BadRequestException('complaintId is required in request body');
    }
    return this.commentsService.create(dto.complaintId, dto, user);
  }

  /**
   * Get single comment by ID
   */
  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser | null,
  ) {
    return this.commentsService.findById(id, user ?? undefined);
  }

  /**
   * Edit comment message (Author or Admin only)
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commentsService.update(id, dto, user);
  }

  /**
   * Delete comment (Author, Staff, or Admin only)
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commentsService.delete(id, user);
  }
}

@Controller('complaints/:complaintId/comments')
export class ComplaintCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * List all discussion comments for a complaint
   */
  @Get()
  @UseGuards(OptionalAuthGuard)
  async findByComplaintId(
    @Param('complaintId', ParseIntPipe) complaintId: number,
    @CurrentUser() user: AuthenticatedUser | null,
  ) {
    return this.commentsService.findByComplaintId(complaintId, user ?? undefined);
  }

  /**
   * Add a comment to a complaint (matches standard REST sub-resource URL)
   */
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Param('complaintId', ParseIntPipe) complaintId: number,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commentsService.create(complaintId, dto, user);
  }
}

