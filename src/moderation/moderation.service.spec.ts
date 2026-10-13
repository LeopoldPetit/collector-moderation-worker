import { Test } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import {
  ARTICLE_REJECTED,
  ARTICLE_VALIDATED,
  ArticleSubmittedEvent,
} from '../events/article-events';
import { ModerationService, RESULT_BUS } from './moderation.service';

const VALID_ARTICLE: ArticleSubmittedEvent = {
  articleId: 'art-1',
  sellerId: 'seller-1',
  title: 'Timbre rare 1920',
  description:
    'Un timbre en excellent état, provenance certifiée, description suffisamment longue.',
  price: 42,
  shippingCost: 5,
  category: 'timbres',
};

describe('ModerationService', () => {
  let service: ModerationService;
  let bus: { emit: jest.Mock };

  beforeEach(async () => {
    bus = { emit: jest.fn(() => of(true)) };

    const moduleRef = await Test.createTestingModule({
      providers: [ModerationService, { provide: RESULT_BUS, useValue: bus }],
    }).compile();

    service = moduleRef.get(ModerationService);
  });

  it("publie article.validated sans motif si l'article est conforme", async () => {
    await service.review(VALID_ARTICLE);

    expect(bus.emit).toHaveBeenCalledWith(ARTICLE_VALIDATED, {
      articleId: 'art-1',
      reasons: [],
    });
  });

  it('publie article.rejected avec les motifs sinon', async () => {
    await service.review({ ...VALID_ARTICLE, description: 'trop court' });

    expect(bus.emit).toHaveBeenCalledWith(ARTICLE_REJECTED, {
      articleId: 'art-1',
      reasons: [expect.stringContaining('description')],
    });
  });

  it("propage l'erreur si le bus de résultats est indisponible", async () => {
    bus.emit.mockReturnValue(throwError(() => new Error('broker down')));

    await expect(service.review(VALID_ARTICLE)).rejects.toThrow('broker down');
  });
});
