import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { instanceToPlain } from 'class-transformer';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() dto: CreateOfferDto, @Request() req) {
    return this.offersService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyOffers(@Request() req) {
    const offers = await this.offersService.findAll(req.user.id);

    return instanceToPlain(offers);
  }

  @Get(':itemId')
  async getOffers(@Param('itemId') itemId: number) {
    const offer = await this.offersService.findByItemId(itemId);

    return instanceToPlain(offer);
  }
}
