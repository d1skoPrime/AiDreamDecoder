import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';

@Injectable()
export class SymbolsService {
  constructor(private prisma: PrismaService) {}

  async getAllSymbols(req: Request) {
    const email = req.user.email;

    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: { subscription: true },
    });

    if (user?.subscription?.tier === 'FREE')
      throw new UnauthorizedException(
        'You do not have access to this feature!',
      );
    const symbols = await this.prisma.symbol.findMany({});

    return symbols;
  }

  async AddNewSymbols(dto: CreateSymbolDto) {
    const symbolexists = await this.prisma.symbol.findUnique({
      where: { name: dto.name },
    });
    if (symbolexists)
      throw new BadRequestException('This symbols is already exists!');

    try {
      const createdSymbols = await this.prisma.symbol.create({
        data: {
          name: dto.name,
          category: dto.category,
          description: dto.description,
        },
      });

      return createdSymbols;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDream(symbolId: string, req: Request) {
    const SymbolExists = await this.prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!SymbolExists) throw new BadRequestException('Symbol not found!');

    try {
      const deletedSymbol = await this.prisma.symbol.delete({
        where: { id: symbolId },
      });

      return { message: 'Success!', ...deletedSymbol };
    } catch (error) {
      console.log(error);
    }
  }

  async EditSymbol(dto: UpdateSymbolDto, symbolId: string) {
    const symbolExists = await this.prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!symbolExists) throw new BadRequestException('Symbol not found');

    try {
      const editedSymbol = await this.prisma.symbol.update({
        where: { id: symbolId },
        data: {
          category: dto.category,
          description: dto.description,
          name: dto.name,
        },
      });
      return { message: 'Success!', editedSymbol };
    } catch (error) {
      console.log(error);
    }
  }
}
