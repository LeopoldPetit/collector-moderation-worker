import { ArticleContent, moderateArticle } from './moderation-rules';

const VALID: ArticleContent = {
  title: 'Timbre rare 1920',
  description:
    'Un timbre en excellent état, provenance certifiée, description suffisamment longue.',
  price: 42,
  shippingCost: 5,
  category: 'timbres',
};

describe('moderateArticle', () => {
  it('accepte un article conforme', () => {
    expect(moderateArticle(VALID)).toEqual([]);
  });

  it('signale un titre vide', () => {
    expect(moderateArticle({ ...VALID, title: '   ' })).toContain(
      'titre manquant',
    );
  });

  it('signale les frais de port manquants', () => {
    expect(
      moderateArticle({ ...VALID, shippingCost: NaN as unknown as number }),
    ).toContain('frais de port manquants');
  });

  it('signale une catégorie inconnue, y compris un nom de propriété JavaScript', () => {
    expect(moderateArticle({ ...VALID, category: 'inconnue' })).toContain(
      'catégorie inconnue',
    );
    expect(moderateArticle({ ...VALID, category: 'constructor' })).toContain(
      'catégorie inconnue',
    );
  });

  it("exige une description d'au moins 50 caractères", () => {
    const reasons = moderateArticle({ ...VALID, description: 'trop court' });
    expect(reasons).toEqual(['description inférieure à 50 caractères']);
  });

  it('refuse un prix nul ou négatif', () => {
    expect(moderateArticle({ ...VALID, price: 0 })).toContain(
      'prix doit être supérieur à 0',
    );
    expect(moderateArticle({ ...VALID, price: -3 })).toContain(
      'prix doit être supérieur à 0',
    );
  });

  it('refuse un prix au niveau ou au-delà du seuil de la catégorie', () => {
    const reasons = moderateArticle({ ...VALID, price: 10000 });
    expect(reasons).toEqual([
      'prix supérieur ou égal au seuil de la catégorie (10000 €)',
    ]);
  });

  it('détecte les mots interdits sans tenir compte des accents ni de la casse', () => {
    const reasons = moderateArticle({
      ...VALID,
      description: `Vendu comme CONTREFAÇON garantie, ${VALID.description}`,
    });
    expect(reasons).toEqual(['mots interdits : contrefacon']);
  });

  it('cumule tous les motifs pour un article entièrement non conforme', () => {
    const reasons = moderateArticle({
      title: '',
      description: 'arnaque',
      price: 0,
      shippingCost: 5,
      category: 'inconnue',
    });
    expect(reasons.length).toBeGreaterThanOrEqual(4);
  });
});
