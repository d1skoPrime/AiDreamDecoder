import { JwtCookieAuthGuard } from '@/guards/jwtcookie-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RoleCheckGuard } from 'src/guards/role.check.guard';
import { Roles } from 'src/guards/role.user.decorator';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import { SymbolsService } from './symbols.service';

@Controller('symbols')
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) {}

  @UseGuards(JwtCookieAuthGuard)
  @Get()
  async getAllSymbols(@Req() req: Request) {
    return this.symbolsService.getAllSymbols(req);
  }

  @UseGuards(JwtCookieAuthGuard, RoleCheckGuard)
  @Roles('ADMIN')
  @Post()
  async AddNewSymbol(@Body() dto: CreateSymbolDto) {
    return this.symbolsService.AddNewSymbols(dto);
  }

  @UseGuards(JwtCookieAuthGuard, RoleCheckGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async EditSymbol(@Body() dto: UpdateSymbolDto, @Param('id') id: string) {
    return this.symbolsService.EditSymbol(dto, id);
  }

  @UseGuards(JwtCookieAuthGuard, RoleCheckGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async DeleteDream(@Param('id') id: string, @Req() req: Request) {
    return this.symbolsService.deleteDream(id, req);
  }
}
