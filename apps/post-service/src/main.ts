import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const envFilePath = path.resolve(process.cwd(), `.env.post`);

  // dotenv.config({ path: envFilePath });
  const configService = app.get(ConfigService);

  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');
  if (!RABBITMQ_URL) {
    throw new Error('RABBITMQ_URL is not defined in environment variables');
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: 'post_queue',
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Post Service')
    .setDescription('Handles blog post CRUD operations')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`Post Service is running on port ${port}`);
}

void bootstrap();
