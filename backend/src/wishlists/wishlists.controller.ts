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
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { instanceToPlain } from 'class-transformer';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() dto: CreateWishlistDto, @Request() req) {
    return this.wishlistsService.create(dto, req.user);
  }

  @Get()
  async findAll() {
    const wishlists = await this.wishlistsService.findAll();

    return instanceToPlain(wishlists);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const wishlist = this.wishlistsService.findOne({ id });

    return instanceToPlain(wishlist);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateWishlistDto,
    @Request() req,
  ) {
    return this.wishlistsService.updateOneByUser(id, req.user, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    return this.wishlistsService.removeOneByUser(id, req.user);
  }
}
