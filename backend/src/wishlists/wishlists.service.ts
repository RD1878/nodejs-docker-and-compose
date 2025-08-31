import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateWishlistDto, owner: User) {
    const wishes = await this.wishesRepository.findBy({
      id: In(dto.items),
    });
    const wishlist = this.wishlistsRepository.create({
      ...dto,
      owner,
      items: wishes,
    });
    return this.wishlistsRepository.save(wishlist);
  }

  async findOne(where: FindOptionsWhere<Wishlist>) {
    return await this.wishlistsRepository.findOne({
      where,
      relations: ['items', 'owner'],
    });
  }

  async findAll() {
    return this.wishlistsRepository.find({
      relations: ['owner', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOneByUser(
    id: number,
    user: User,
    dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne({ id });

    if (!wishlist) {
      throw new NotFoundException('Подборка подарков не найдена');
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Изменение чужой подборки невозможно');
    }

    if (dto.items) {
      const wishes = await this.wishesRepository.findBy({ id: In(dto.items) });
      wishlist.items = wishes;
    }

    wishlist.name = dto.name ?? wishlist.name;
    wishlist.description = dto.description ?? wishlist.description;
    wishlist.image = dto.image ?? wishlist.image;
    wishlist.updatedAt = new Date();

    return this.wishlistsRepository.save(wishlist);
  }

  async removeOneByUser(id: number, user: User) {
    const wishlist = await this.findOne({ id });

    if (!wishlist) {
      throw new NotFoundException('Подборка подарков не найдена');
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Удаление чужой подборки невозможно');
    }

    return this.wishlistsRepository.delete({ id });
  }
}
