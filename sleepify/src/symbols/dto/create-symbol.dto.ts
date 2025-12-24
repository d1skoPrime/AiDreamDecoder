import { IsString } from 'class-validator';

export class CreateSymbolDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  description: string;
}
