import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class TagDto {
  @ApiProperty({ example: 'TypeScript', description: 'Name of the tag' })
  @IsString()
  @IsNotEmpty()
  name?: string;
}

export class CreatePostDto {
  @ApiProperty({ example: 'My first post', description: 'Title of the post' })
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    example: 'This is the content of my first post',
    description: 'Content of the post',
  })
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiProperty({ example: true, description: 'Is the post published?' })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  // @ApiProperty({ example: 1, description: 'Author user ID' })
  // @IsOptional()
  // @IsNumber()
  // authorId?: number;

  @ApiProperty({
    type: [TagDto],
    description: 'List of tags',
    example: [{ name: 'nestjs' }, { name: 'typeorm' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags?: TagDto[];
}
