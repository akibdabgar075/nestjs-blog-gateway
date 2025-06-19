import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
