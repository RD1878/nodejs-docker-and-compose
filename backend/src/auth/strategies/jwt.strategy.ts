import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username };
  }
}
