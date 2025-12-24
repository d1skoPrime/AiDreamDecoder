import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDreamDto {
  @IsString()
  @MaxLength(100, { message: 'Title too long. Max 100 characters allowed.' })
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000, {
    message: 'Dream description is too long. Max 2000 characters allowed.',
  })
  content: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ArrayNotEmpty()
  @IsString({ each: true })
  emotions: string[];
}
