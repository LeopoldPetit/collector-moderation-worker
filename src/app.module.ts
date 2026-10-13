import { Module } from '@nestjs/common';
import { ModerationModule } from './moderation/moderation.module';

@Module({
  imports: [ModerationModule],
})
export class AppModule {}
