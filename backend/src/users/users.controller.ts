import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { instanceToPlain } from 'class-transformer';
import { FindUserDto } from 'src/users/dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const user = await this.usersService.findOne({
      username: req.user.username,
    });

    if (!user) return null;

    const { password, ...userData } = user;

    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateOne({ id: req.user.id }, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  async getMyWishes(@Request() req) {
    const wishes = await this.usersService.findUserWishes({
      id: req.user.id,
    });

    return instanceToPlain(wishes);
  }

  @Post('find')
  find(@Body() dto: FindUserDto) {
    return this.usersService.findMany(dto.query);
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });

    if (!user) return null;

    const { password, ...userData } = user;

    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  async getByUsernameWishes(@Param('username') username: string) {
    const wishes = await this.usersService.findUserWishes({ username });

    return instanceToPlain(wishes);
  }
}
