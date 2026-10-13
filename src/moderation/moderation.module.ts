import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBITMQ_URLS } from '../config/rabbitmq.config';
import { RESULTS_QUEUE } from '../events/article-events';
import { ModerationController } from './moderation.controller';
import { ModerationService, RESULT_BUS } from './moderation.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RESULT_BUS,
        transport: Transport.RMQ,
        options: {
          urls: RABBITMQ_URLS,
          queue: RESULTS_QUEUE,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [ModerationController],
  providers: [ModerationService],
})
export class ModerationModule {}
