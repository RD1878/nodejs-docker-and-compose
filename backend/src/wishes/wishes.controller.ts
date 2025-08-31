import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
import { instanceToPlain } from 'class-transformer';

@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() dto: CreateWishDto, @Request() req) {
    return this.wishesService.create(dto, req.user);
  }

  @Get()
  async getAll() {
    const wishes = await this.wishesService.findAll();

    return instanceToPlain(wishes);
  }

  @Get('last')
  async getLast() {
    const wishes = await this.wishesService.findLastWishes();
    return instanceToPlain(wishes);
  }

  @Get('top')
  async getTop() {
    const wishes = await this.wishesService.findTopWishes();
    return instanceToPlain(wishes);
  }

  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Request() req) {
    const copiedWish = await this.wishesService.copyWish(id, req.user);

    return instanceToPlain(copiedWish);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const wish = await this.wishesService.findOne({ id });

    return instanceToPlain(wish);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateWishDto,
    @Request() req,
  ) {
    return this.wishesService.updateWishByOwner(id, req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    return this.wishesService.deleteWishByOwner(id, req.user.id);
  }
}
