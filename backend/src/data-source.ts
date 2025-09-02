import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';

const ssl =
    process.env.POSTGRES_SSL === 'true' || process.env.POSTGRES_SSL === '1'
        ? { rejectUnauthorized: false }
        : false;
export default new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'database',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'kupipodariday',
    synchronize: false,
    migrationsRun: false,
    logging: false,
    entities: [User, Wish, Wishlist, Offer],
    migrations: ['dist/src/migrations/*.js', 'src/migrations/*.ts'],
    subscribers: [],
    ssl,
});
