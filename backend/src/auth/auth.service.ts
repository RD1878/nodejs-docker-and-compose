import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, userPassword: string) {
    const user = await this.usersService.findOneWithPassword({ username });

    if (user) {
      const isValidUser = await bcrypt.compare(userPassword, user.password);

      if (!isValidUser) {
        return null;
      }
      const { password, ...userData } = user;

      return userData;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
