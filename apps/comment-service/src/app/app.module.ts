import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from './comment/entities/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { DbConfigModule } from '@workspace/db-config';
import { SharedModule } from '@workspace/shared';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule.register(),
    // DbConfigModule.register('comment'),
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
        entities: [Comment],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([Comment]),
    CommentModule,
  ],
})
export class AppModule {}
