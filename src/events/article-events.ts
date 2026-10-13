export const MODERATION_QUEUE = 'moderation';
export const RESULTS_QUEUE = 'moderation-results';

export const ARTICLE_SUBMITTED = 'article.submitted';
export const ARTICLE_VALIDATED = 'article.validated';
export const ARTICLE_REJECTED = 'article.rejected';

export interface ArticleSubmittedEvent {
  articleId: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  shippingCost: number;
  category: string;
}

export interface ArticleModerationResult {
  articleId: string;
  reasons: string[];
}
