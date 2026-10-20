import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AddCommentDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isInternalNote?: boolean = false;
}

