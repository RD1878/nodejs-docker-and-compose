import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findOne({ id: dto.itemId });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Нельзя скидываться на свой подарок');
    }

    if (wish.raised >= wish.price) {
      throw new BadRequestException('Деньги на подарок уже собраны');
    }

    const availableAmount = wish.price - wish.raised;
    if (dto.amount > availableAmount) {
      throw new BadRequestException(
        `Ты ввел большую сумму. Осталось внести ${availableAmount}`,
      );
    }

    const offer = this.offersRepository.create({
      item: wish,
      amount: dto.amount,
      hidden: dto.hidden,
      user,
    });

    await this.offersRepository.save(offer);

    await this.wishesService.updateOne(
      { id: wish.id },
      { raised: Number(wish.raised) + dto.amount },
    );

    return offer;
  }

  async findAll(userId: number) {
    return this.offersRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['item', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByItemId(itemId: number) {
    return this.offersRepository.find({
      where: { item: { id: itemId } },
      relations: ['user'],
    });
  }
}
