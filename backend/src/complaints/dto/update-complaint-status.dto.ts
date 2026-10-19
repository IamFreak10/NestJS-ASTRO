import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import type { ComplaintStatus } from '../complaints.interface.js';

export class UpdateComplaintStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['submitted', 'under_review', 'in_progress', 'resolved', 'rejected'], {
    message:
      'Status must be one of: submitted, under_review, in_progress, resolved, rejected',
  })
  status!: ComplaintStatus;

  @IsOptional()
  @IsString()
  resolutionNote?: string;

  @IsOptional()
  @IsString()
  assignedStaffId?: string;

  @IsOptional()
  @IsString()
  commentMessage?: string;

  @IsOptional()
  @IsBoolean()
  isInternalNote?: boolean = false;
}

