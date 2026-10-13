import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ARTICLE_REJECTED,
  ARTICLE_VALIDATED,
  ArticleSubmittedEvent,
} from '../events/article-events';
import { moderateArticle } from './rules/moderation-rules';

export const RESULT_BUS = 'RESULT_BUS';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(@Inject(RESULT_BUS) private readonly resultBus: ClientProxy) {}

  async review(article: ArticleSubmittedEvent): Promise<void> {
    const reasons = moderateArticle(article);
    const pattern = reasons.length === 0 ? ARTICLE_VALIDATED : ARTICLE_REJECTED;

    await lastValueFrom(
      this.resultBus.emit(pattern, { articleId: article.articleId, reasons }),
    );
    this.logger.log(`${pattern} articleId=${article.articleId}`);
  }
}
