import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Global()
@Module({})
export class DbConfigModule {
  static register(service: string): DynamicModule {
    const envFilePath = path.resolve(process.cwd(), `.env.${service}`);

    return {
      module: DbConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath,
          expandVariables: true, // Optional: supports env var interpolation
        }),
      ],
      exports: [ConfigModule],
    };
  }
}
