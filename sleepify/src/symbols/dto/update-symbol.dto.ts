import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateSymbolDto } from './create-symbol.dto';

export class UpdateSymbolDto extends PartialType(CreateSymbolDto) {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  category?: string;
  @IsOptional()
  @IsString()
  description?: string | undefined;
}
