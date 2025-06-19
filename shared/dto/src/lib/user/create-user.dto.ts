import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'akib dabgar' })
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({ example: 'akib@example.com' })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Testing@123' })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'A short bio about the user.' })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'akib@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({ example: 'Testing@123' })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  password?: string;
}
