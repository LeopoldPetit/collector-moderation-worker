import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RABBITMQ_URLS } from './config/rabbitmq.config';
import { MODERATION_QUEUE } from './events/article-events';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: RABBITMQ_URLS,
        queue: MODERATION_QUEUE,
        queueOptions: { durable: true },
      },
    },
  );
  await app.listen();
}
bootstrap();
