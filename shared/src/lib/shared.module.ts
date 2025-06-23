// workspace/libs/shared/src/lib/shared.module.ts

import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from './redis/redis.module';
@Global()
@Module({})
export class SharedModule {
  static register(): DynamicModule {
    return {
      module: SharedModule,
      imports: [
        ConfigModule,
        RedisModule,
        ClientsModule.registerAsync([
          {
            name: 'POST_SERVICE',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const url = configService.get<string>('RABBITMQ_URL');
              console.log('urlllllllll', url);

              if (!url) {
                throw new Error('RABBITMQ_URL is not set');
              }
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [url],
                  queue: 'post_queue',
                  queueOptions: {
                    durable: false,
                  },
                },
              };
            },
          },
          {
            name: 'COMMENT_SERVICE',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const url = configService.get<string>('RABBITMQ_URL');
              if (!url) {
                throw new Error('RABBITMQ_URL is not set');
              }
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [url],
                  queue: 'comment_queue',
                  queueOptions: {
                    durable: false,
                  },
                },
              };
            },
          },
          {
            name: 'USER_SERVICE',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const url = configService.get<string>('RABBITMQ_URL');
              if (!url) {
                throw new Error('RABBITMQ_URL is not set');
              }
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [url],
                  queue: 'user_queue',
                  queueOptions: {
                    durable: false,
                  },
                },
              };
            },
          },
        ]),
      ],
      exports: [ClientsModule, RedisModule],
    };
  }
}
