import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким именем или email уже существует',
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  findOne(where: FindOptionsWhere<User>) {
    return this.usersRepository.findOne({ where });
  }

  findOneWithPassword(where: FindOptionsWhere<User>) {
    return this.usersRepository.findOne({
      where,
      select: [
        'id',
        'username',
        'email',
        'about',
        'avatar',
        'createdAt',
        'updatedAt',
        'password',
      ],
    });
  }

  findMany(query: string) {
    return this.usersRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
  }

  async updateOne(where: FindOptionsWhere<User>, updateData: Partial<User>) {
    const currentUser = await this.usersRepository.findOne({ where });

    if (!currentUser) {
      throw new Error('Пользователь не найден');
    }

    if (updateData.email || updateData.username) {
      const conflicts: FindOptionsWhere<User>[] = [];

      if (updateData.username && updateData.username !== currentUser.username) {
        conflicts.push({ username: updateData.username });
      }

      if (updateData.email && updateData.email !== currentUser.email) {
        conflicts.push({ email: updateData.email });
      }

      if (conflicts.length > 0) {
        const existingUser = await this.usersRepository.findOne({
          where: conflicts,
        });

        if (existingUser && existingUser.id !== currentUser.id) {
          throw new ConflictException(
            'Пользователь с таким именем или email уже существует',
          );
        }
      }
    }

    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    return this.usersRepository.update(where, {
      ...updateData,
      updatedAt: new Date(),
    });
  }

  async findUserWishes(where: FindOptionsWhere<User>): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where,
      relations: ['wishes', 'wishes.owner'],
    });

    return user?.wishes ?? [];
  }

  removeOne(where: FindOptionsWhere<User>) {
    return this.usersRepository.delete(where);
  }
}
