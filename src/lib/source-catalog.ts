import type { SourceCategory, SourceProduct } from "@/data/source-products";
import type {
  CatalogCollection,
  CatalogSectionId,
} from "@/data/women-catalog";

const ignoredCollectionTokens = new Set([
  "and",
  "bags",
  "belt",
  "best",
  "boots",
  "catalog",
  "category",
  "collection",
  "dress",
  "dresses",
  "edit",
  "fashion",
  "for",
  "new",
  "original",
  "ready",
  "sale",
  "sandals",
  "set",
  "sets",
  "shoes",
  "slides",
  "style",
  "styles",
  "travel",
  "women",
  "womens",
]);

const sectionCategoryMap: Record<CatalogSectionId, SourceCategory[]> = {
  dresses: ["dresses"],
  clothing: ["clothing"],
  bags: ["bags"],
  shoes: ["sneakers", "sandals", "mules"],
  accessories: ["accessories", "hats", "watches", "jewellery"],
  swimwear: ["swimwear"],
};

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(
      (token) =>
        token.length > 2 &&
        !ignoredCollectionTokens.has(token) &&
        !/^\d+$/.test(token),
    );

export const getCollectionCategories = (section: CatalogSectionId) =>
  sectionCategoryMap[section];

export const getSourceProductPath = (id: string) => `/catalog/item/${id}`;

export const getCatalogCollectionPath = (id: string) =>
  `/catalog/collection/${id}`;

const buildCollectionKeywords = (collection: CatalogCollection) =>
  tokenize(collection.name.en);

export const getCollectionMatches = (
  collection: CatalogCollection,
  sourceProducts: SourceProduct[],
) => {
  const baseItems = sourceProducts.filter(
    (item) =>
      item.source === collection.source &&
      getCollectionCategories(collection.section).includes(item.category),
  );

  const keywords = buildCollectionKeywords(collection);
  const scoredItems = baseItems.map((item) => {
    const brand = item.brand.toLowerCase();
    const name = item.name.toLowerCase();
    const originalTitle = item.originalTitle.toLowerCase();

    let score = 0;

    for (const keyword of keywords) {
      if (brand.includes(keyword)) {
        score += 5;
      }

      if (name.includes(keyword)) {
        score += 3;
      }

      if (originalTitle.includes(keyword)) {
        score += 2;
      }
    }

    if (collection.tags.some((tag) => item.tags.includes(tag))) {
      score += 1;
    }

    return { item, score };
  });

  const shouldRequireKeywordMatch = scoredItems.some(({ score }) => score > 0);

  return scoredItems
    .filter(({ score }) => !shouldRequireKeywordMatch || score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (right.item.photoCount ?? 0) - (left.item.photoCount ?? 0);
    })
    .map(({ item }) => item);
};
