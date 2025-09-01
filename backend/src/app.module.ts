import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        // Глобальная конфигурация. В продакшене читаем только переменные окружения контейнера
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
        }),

        // Конфигурация TypeORM через переменные окружения (или DATABASE_URL)
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => {
                const url = cfg.get<string>('DATABASE_URL');
                const allowSync =
                    process.env.NODE_ENV !== 'production' && process.env.DB_SYNC_ON_START === 'true';

                if (url) {
                    return {
                        type: 'postgres',
                        url,
                        autoLoadEntities: true,
                        synchronize: allowSync,
                    } as const;
                }
                return {
                    type: 'postgres',
                    host:
                        cfg.get<string>('POSTGRES_HOST') ||
                        cfg.get<string>('DB_HOST') ||
                        cfg.get<string>('PGHOST') ||
                        'localhost',
                    port: Number(
                        cfg.get<string>('POSTGRES_PORT') ||
                        cfg.get<string>('DB_PORT') ||
                        cfg.get<string>('PGPORT') ||
                        5432,
                    ),
                    username: cfg.get<string>('POSTGRES_USER'),
                    password: cfg.get<string>('POSTGRES_PASSWORD'),
                    database: cfg.get<string>('POSTGRES_DB'),
                    autoLoadEntities: true,
                    synchronize: allowSync,
                } as const;
            },
        }),

        UsersModule,
        WishesModule,
        WishlistsModule,
        OffersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
