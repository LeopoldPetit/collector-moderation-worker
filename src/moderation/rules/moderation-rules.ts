import { ArticleSubmittedEvent } from '../../events/article-events';

export const MIN_DESCRIPTION_LENGTH = 50;

export const CATEGORY_MAX_PRICE: Record<string, number> = {
  comics: 5000,
  monnaies: 50000,
  'cartes-a-collectionner': 20000,
  'jouets-anciens': 10000,
  timbres: 10000,
};

export const FORBIDDEN_WORDS = ['contrefacon', 'arnaque', 'escroquerie'];

export type ArticleContent = Pick<
  ArticleSubmittedEvent,
  'title' | 'description' | 'price' | 'shippingCost' | 'category'
>;

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function maxPriceFor(category: string): number | undefined {
  return Object.prototype.hasOwnProperty.call(CATEGORY_MAX_PRICE, category)
    ? CATEGORY_MAX_PRICE[category]
    : undefined;
}

export function checkRequiredFields(article: ArticleContent): string[] {
  const reasons: string[] = [];
  if (!article.title?.trim()) reasons.push('titre manquant');
  if (!article.description?.trim()) reasons.push('description manquante');
  if (!Number.isFinite(article.price)) reasons.push('prix manquant');
  if (!Number.isFinite(article.shippingCost))
    reasons.push('frais de port manquants');
  if (maxPriceFor(article.category) === undefined)
    reasons.push('catégorie inconnue');
  return reasons;
}

export function checkDescription(article: ArticleContent): string[] {
  const length = (article.description ?? '').trim().length;
  return length >= MIN_DESCRIPTION_LENGTH
    ? []
    : [`description inférieure à ${MIN_DESCRIPTION_LENGTH} caractères`];
}

export function checkPrice(article: ArticleContent): string[] {
  if (!Number.isFinite(article.price)) return [];
  if (article.price <= 0) return ['prix doit être supérieur à 0'];
  const max = maxPriceFor(article.category);
  if (max !== undefined && article.price >= max)
    return [`prix supérieur ou égal au seuil de la catégorie (${max} €)`];
  return [];
}

export function checkForbiddenWords(article: ArticleContent): string[] {
  const text = normalize(`${article.title} ${article.description}`);
  const found = FORBIDDEN_WORDS.filter((word) => text.includes(word));
  return found.length > 0 ? [`mots interdits : ${found.join(', ')}`] : [];
}

export function moderateArticle(article: ArticleContent): string[] {
  return [
    ...checkRequiredFields(article),
    ...checkDescription(article),
    ...checkPrice(article),
    ...checkForbiddenWords(article),
  ];
}
