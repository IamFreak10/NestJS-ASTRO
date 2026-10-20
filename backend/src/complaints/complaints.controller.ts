import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service.js';
import { CreateComplaintDto } from './dto/create-complaint.dto.js';
import { FilterComplaintsQueryDto } from './dto/filter-complaints.dto.js';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto.js';
import { AuthGuard, CurrentUser } from '../auth/guards/auth.guard.js';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard.js';
import { StaffGuard } from '../auth/guards/staff.guard.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  /**
   * File a new complaint or sealed grievance
   */
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreateComplaintDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.complaintsService.create(dto, user);
  }

  /**
   * Public Campus Notice Board feed (anonymous users allowed, logged-in students see upvote state)
   */
  @Get('public')
  @UseGuards(OptionalAuthGuard)
  async findPublic(
    @Query() filters: FilterComplaintsQueryDto,
    @CurrentUser() user: AuthenticatedUser | null,
  ) {
    return this.complaintsService.findPublic(filters, user?.id);
  }

  /**
   * Logged-in student's dashboard complaints (includes both public and private grievances)
   */
  @Get('my')
  @UseGuards(AuthGuard)
  async findMyComplaints(@CurrentUser() user: AuthenticatedUser) {
    return this.complaintsService.findMyComplaints(user.id);
  }

  /**
   * View single complaint details & timeline notes (with IDOR protection for private grievances)
   */
  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser | null,
  ) {
    return this.complaintsService.findById(id, user ?? undefined);
  }

  /**
   * "+1 Me Too" Upvote toggle endpoint
   */
  @Post(':id/upvote')
  @UseGuards(AuthGuard)
  async toggleUpvote(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.complaintsService.toggleUpvote(id, user.id);
  }

  /**
   * Staff/Admin Resolution & Status triage
   */
  @Patch(':id/status')
  @UseGuards(AuthGuard, StaffGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateComplaintStatusDto,
    @CurrentUser() staffUser: AuthenticatedUser,
  ) {
    return this.complaintsService.updateStatus(id, dto, staffUser);
  }
}
