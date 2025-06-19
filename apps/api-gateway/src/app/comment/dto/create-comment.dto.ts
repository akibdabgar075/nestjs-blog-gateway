import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
