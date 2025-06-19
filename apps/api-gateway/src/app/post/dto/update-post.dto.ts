import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    example: 'Updated title',
    description: 'Title of the post',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated content',
    description: 'Content of the post',
  })
  @IsString()
  @IsOptional()
  content?: string;
}
