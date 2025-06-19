import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Blog Gateway API')
    .setDescription('Gateway for Post and Comment microservices')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(morgan('dev'));
  app.enableCors({
    allowedHeaders: 'Authorization,Content-Type',
  });
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Gateway Service is running on port ${port}`);
}
bootstrap();
