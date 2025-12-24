import { JwtCookieAuthGuard } from '@/guards/jwtcookie-auth.guard';
import { DreamValidationPipe } from '@/pipes/PromptValidation.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { DreamsService } from './dreams.service';
import { CreateDreamDto } from './dto/create-dream.dto';

@Controller('dreams')
export class DreamsController {
  constructor(private readonly dreamsService: DreamsService) {}

  @UseGuards(JwtCookieAuthGuard)
  @Throttle({ default: { limit: 6, ttl: 60 } })
  @Post()
  async AddDream(
    @Body(new DreamValidationPipe()) dto: CreateDreamDto,
    @Req() req: Request,
  ) {
    return this.dreamsService.AddDream(dto, req);
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get()
  async getDreams(@Req() req: Request) {
    return this.dreamsService.getDreams(req);
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get(':id')
  async getCertainDream(@Param('id') id: string, @Req() req: Request) {
    return this.dreamsService.getCertainDream(id, req);
  }
  @UseGuards(JwtCookieAuthGuard)
  @Delete(':id')
  async deleteCertainDream(@Param('id') id: string, @Req() req: Request) {
    return this.dreamsService.deleteCertainDream(id, req);
  }

  @Get('limit-status')
  @UseGuards(JwtCookieAuthGuard) // Your auth guard
  async getLimitStatus(@Req() req: Request) {
    return this.dreamsService.getUserLimitStatus(req);
  }
}
