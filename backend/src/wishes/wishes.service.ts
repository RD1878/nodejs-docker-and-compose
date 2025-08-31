import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateWishDto, owner: User) {
    const wish = this.wishesRepository.create({
      ...dto,
      owner,
    });

    return this.wishesRepository.save(wish);
  }

  async findAll() {
    return this.wishesRepository.find({
      relations: ['owner', 'offers'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(where: FindOptionsWhere<Wish>) {
    const wish = await this.wishesRepository.findOne({
      where,
      relations: ['owner', 'offers'],
    });

    if (!wish) throw new NotFoundException('Желаемый подарок не найден');

    return wish;
  }

  async updateOne(where: FindOptionsWhere<Wish>, updateData: Partial<Wish>) {
    return this.wishesRepository.update(where, {
      ...updateData,
      updatedAt: new Date(),
    });
  }

  async removeOne(where: FindOptionsWhere<Wish>) {
    return this.wishesRepository.delete(where);
  }

  async updateWishByOwner(wishId: number, userId: number, dto: UpdateWishDto) {
    const wish = await this.findOne({ id: wishId });

    if (!wish) throw new NotFoundException('Желаемый подарок не найден');
    if (wish.owner.id !== userId)
      throw new ForbiddenException('Это не ваш желаемый подарок');

    const hasOffers = !!wish.offers?.length;
    if (hasOffers && dto.price && dto.price !== wish.price) {
      throw new BadRequestException(
        'Нельзя менять цену, если уже на подарок уже кто-то скинулся',
      );
    }

    return this.updateOne({ id: wishId }, dto);
  }

  async deleteWishByOwner(wishId: number, userId: number) {
    const wish = await this.findOne({ id: wishId });

    if (!wish) throw new NotFoundException('Желаемый подарок не найден');
    if (wish.owner.id !== userId)
      throw new ForbiddenException(
        'Вы не можете удалить чужой желаемый подарок',
      );

    return this.removeOne({ id: wishId });
  }

  async findLastWishes() {
    return this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: ['owner'],
    });
  }

  async findTopWishes() {
    return this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
      relations: ['owner'],
    });
  }

  async copyWish(id: number, currentUser: User) {
    const wish = await this.findOne({ id });

    if (wish.owner.id === currentUser.id) {
      throw new BadRequestException('Копирование своего подарка невозможно');
    }

    const newWish = this.wishesRepository.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: currentUser,
    });

    await this.wishesRepository.save(newWish);

    wish.copied += 1;
    await this.wishesRepository.save(wish);

    return newWish;
  }
}
