import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../complaints.interface.js';

export class FilterComplaintsQueryDto {
  @IsOptional()
  @IsString()
  @IsIn([
    'facilities',
    'hostel_canteen',
    'transport',
    'academics',
    'safety_bullying',
    'administration',
  ])
  category?: ComplaintCategory;

  @IsOptional()
  @IsString()
  @IsIn(['submitted', 'under_review', 'in_progress', 'resolved', 'rejected'])
  status?: ComplaintStatus;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: ComplaintPriority;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

