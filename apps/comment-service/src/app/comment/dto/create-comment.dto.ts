import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  authorId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
