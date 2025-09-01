import 'reflect-metadata';
import { DataSource } from 'typeorm';

const host =
    process.env.POSTGRES_HOST ||
    process.env.DB_HOST ||
    process.env.PGHOST ||
    'localhost';

export default new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL, // если задано — возьмёт приоритетно
    host: process.env.DATABASE_URL ? undefined : host,
    port: process.env.DATABASE_URL ? undefined : Number(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
});
