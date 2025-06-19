import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { DbConfigModule } from '@workspace/db-config';
import { SharedModule } from '@workspace/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule.register(),
    // DbConfigModule.register(''),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [],
          // synchronize: true,
          autoLoadEntities: true,
          logging: true,
        };
      },
    }),

    TypeOrmModule.forFeature(),
    AuthModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
