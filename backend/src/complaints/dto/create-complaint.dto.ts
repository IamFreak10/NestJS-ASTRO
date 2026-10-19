import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintVisibility,
} from '../complaints.interface.js';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(
    [
      'facilities',
      'hostel_canteen',
      'transport',
      'academics',
      'safety_bullying',
      'administration',
    ],
    {
      message:
        'Category must be one of: facilities, hostel_canteen, transport, academics, safety_bullying, administration',
    },
  )
  category!: ComplaintCategory;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'private'], {
    message: 'Visibility must be either public or private',
  })
  visibility?: ComplaintVisibility = 'public';

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean = false;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high', 'urgent'], {
    message: 'Priority must be one of: low, medium, high, urgent',
  })
  priority?: ComplaintPriority = 'medium';
}

