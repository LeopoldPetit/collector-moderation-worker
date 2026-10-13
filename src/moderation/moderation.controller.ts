import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  ARTICLE_SUBMITTED,
  ArticleSubmittedEvent,
} from '../events/article-events';
import { ModerationService } from './moderation.service';

@Controller()
export class ModerationController {
  constructor(private readonly moderation: ModerationService) {}

  @EventPattern(ARTICLE_SUBMITTED)
  handleSubmitted(@Payload() article: ArticleSubmittedEvent): Promise<void> {
    return this.moderation.review(article);
  }
}
