import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Comment message cannot be empty' })
  message!: string;

  @IsOptional()
  @IsBoolean()
  isInternalNote?: boolean = false;
}

