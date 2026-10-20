import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

