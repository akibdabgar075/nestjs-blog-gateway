import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';
import { SharedModule } from '@workspace/shared';
import { DbConfigModule } from '@workspace/db-config';
import { Tag } from './post/entities/tag.entity';
import { RedisModule } from 'shared/src/lib/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // DbConfigModule.register('post'),
    SharedModule.register(),
    RedisModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Post, Tag],
        synchronize: false,
        logging: true,
      }),
    }),

    PostModule,
  ],
})
export class AppModule {}
