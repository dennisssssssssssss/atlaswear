import { existsSync, statSync } from "node:fs";
import path from "node:path";

import { getMinimumPublicPriceRon } from "./pricingCalculator.mjs";

export const knownCategories = [
  "dresses",
  "clothing",
  "bags",
  "sneakers",
  "sandals",
  "mules",
  "boots",
  "swimwear",
  "accessories",
  "hats",
  "watches",
  "jewellery",
  "polo-shirts",
  "hoodies",
  "caps",
  "sunglasses",
  "men-sneakers",
  "men-watches",
  "jackets",
  "pants",
];

export const knownCategorySet = new Set(knownCategories);

const footwearCategories = new Set([
  "sneakers",
  "men-sneakers",
  "sandals",
  "mules",
  "boots",
]);

const watchCategories = new Set(["watches", "men-watches"]);
const accessoryCategories = new Set(["accessories", "hats", "caps", "sunglasses"]);

const normalize = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const localizeText = (value) => {
  if (!value || typeof value !== "object") {
    return "";
  }

  return normalize([value.en, value.ro].join(" "));
};

export const getProductAuditText = (product) =>
  normalize(
    [
      product.id,
      product.name,
      product.brand,
      product.category,
      product.originalTitle,
      localizeText(product.sourceCollection),
    ].join(" "),
  ).toLowerCase();

const footwearPattern =
  /\b(?:shoes?|sneakers?|trainers?|runners?|loafers?|oxfords?|derbys?|moccasins?|monks?|brogues?|boots?|chelsea|sandals?|slides?|flip\s*flops?|heels?|pumps?|stilettos?|mules?|flats?|ballet|slippers?)\b/i;

const formalFootwearPattern =
  /\b(?:dress\s*shoes?\d*|loafers?|oxfords?|derbys?|moccasins?|monks?|brogues?)\b/i;

const sandalPattern = /\b(?:sandals?|slides?|flip\s*flops?|slippers?)\b/i;
const heelPattern = /\b(?:heels?|pumps?|stilettos?)\b/i;
const bootPattern = /\b(?:boots?|chelsea|anacapa)\b/i;
const bagPattern =
  /\b(?:bags?|handbags?|shoulder\s*bags?|crossbody|totes?|purses?|clutches?|pochettes?|backpacks?|wallets?|hobo|satchels?|flamenco|puzzle|nolita)\b/i;
const watchPattern = /\b(?:watch|watches|ceasuri?)\b/i;
const jewelleryPattern =
  /\b(?:jewellery|jewelry|bracelets?|rings?|earrings?|necklaces?|bijuterii?)\b/i;
const sunglassesPattern = /\b(?:sunglasses?|glasses|ochelari)\b/i;
const hatPattern = /\b(?:hats?|caps?|beanies?|bucket\s*hats?|sepci?)\b/i;
const dressPattern = /\b(?:dresses?|gowns?|rochii?)\b/i;
const dressExceptionPattern =
  /\b(?:dress\s*shoes?\d*|dress\s*shirts?|dress\s*pants|dress\s*socks?)\b/i;
const clothingPattern =
  /\b(?:t[-\s]?shirts?|tees?|shirts?|jackets?|coats?|hoodies?|sweaters?|pants?|shorts?|jeans?|vests?|suits?|tracksuits?)\b/i;
const genericAtlasNamePattern =
  /^ATLAS\s+(?:Dress|Piece|Bag|Sneaker|Sandal|Mule|Boot|Swimwear|Accessory|Hat|Watch|Jewellery|Polo Shirt|Hoodie|Cap|Sunglasses|Jacket|Pants)$/i;
const nonStorefrontProductPattern =
  /\b(?:perfumes?|fragrances?|socks?|oversleeves?)\b/i;
const weakStorefrontNamePattern =
  /^(?:touch|single|other|low|high|piece|man\s+bagb?|single\s+shoulder\s+bag|other\s+women'?s\s+bag\s+single|women'?s\s+bag|single\s+bag)$/i;

const getLocalImageFileSize = (image) => {
  if (!image?.startsWith("/")) {
    return null;
  }

  const imagePath = path.join(process.cwd(), "public", image);

  if (!existsSync(imagePath)) {
    return null;
  }

  return statSync(imagePath).size;
};

const expectedFootwearCategory = (text, audience, fallbackCategory) => {
  if (bootPattern.test(text)) {
    return "boots";
  }

  if (sandalPattern.test(text) || heelPattern.test(text)) {
    return "sandals";
  }

  if (formalFootwearPattern.test(text)) {
    return audience === "women" ? "mules" : "men-sneakers";
  }

  if (footwearCategories.has(fallbackCategory) && fallbackCategory !== "dresses") {
    return fallbackCategory;
  }

  return audience === "men" || audience === "unisex" ? "men-sneakers" : "sneakers";
};

const countByCategory = (products) =>
  knownCategories.reduce((counts, category) => {
    const count = products.filter((product) => product.category === category).length;

    if (count > 0) {
      counts[category] = count;
    }

    return counts;
  }, {});

const compactIssue = (issue) => ({
  severity: issue.severity,
  code: issue.code,
  message: issue.message,
  ...(issue.expectedCategory ? { expectedCategory: issue.expectedCategory } : {}),
});

const addIssue = (issues, severity, code, message, expectedCategory) => {
  issues.push({
    severity,
    code,
    message,
    ...(expectedCategory ? { expectedCategory } : {}),
  });
};

export const auditCatalogProduct = (product) => {
  const issues = [];
  const text = getProductAuditText(product);
  const category = product.category;
  const audience = product.audience ?? "unisex";

  if (!normalize(product.id)) {
    addIssue(issues, "blocker", "missing-id", "Product is missing id.");
  }

  if (!normalize(product.name)) {
    addIssue(issues, "blocker", "missing-name", "Product is missing name.");
  }

  if (!normalize(product.brand)) {
    addIssue(issues, "blocker", "missing-brand", "Product is missing brand.");
  }

  if (!knownCategorySet.has(category)) {
    addIssue(
      issues,
      "blocker",
      "unknown-category",
      `Unknown category "${category}".`,
    );
  }

  if (!Array.isArray(product.images) || product.images.length === 0) {
    addIssue(issues, "blocker", "missing-image", "Product has no images.");
  } else if (!normalize(product.images[0])) {
    addIssue(issues, "blocker", "empty-image", "Product primary image is empty.");
  } else {
    const imageFileSize = getLocalImageFileSize(product.images[0]);

    if (imageFileSize === 0) {
      addIssue(issues, "blocker", "empty-image-file", "Product image file is empty.");
    } else if (imageFileSize !== null && imageFileSize < 5000) {
      addIssue(
        issues,
        "blocker",
        "image-file-too-small",
        "Product image file is too small to be reliable.",
      );
    }
  }

  if (!Number.isFinite(product.priceRon) || product.priceRon <= 0) {
    addIssue(issues, "blocker", "invalid-price", "Product has invalid price.");
  } else {
    const minimumPublicPriceRon = getMinimumPublicPriceRon(product);

    if (product.priceRon < minimumPublicPriceRon) {
      addIssue(
        issues,
        "blocker",
        "luxury-price-too-low",
        `Product price is below the public minimum of ${minimumPublicPriceRon} RON.`,
      );
    }
  }

  if (product.brand === "ATLAS Selection") {
    addIssue(
      issues,
      "blocker",
      "fallback-brand-atlas-selection",
      "Fallback brand is not strong enough for the public storefront.",
    );
  }

  if (product.brand === "ATLAS Selection" && genericAtlasNamePattern.test(product.name)) {
    addIssue(
      issues,
      "blocker",
      "generic-atlas-selection",
      "Generic ATLAS Selection product is not premium enough for the storefront.",
    );
  }

  if (weakStorefrontNamePattern.test(product.name)) {
    addIssue(
      issues,
      "blocker",
      "weak-storefront-name",
      "Product name is too vague for the public storefront.",
    );
  }

  if (nonStorefrontProductPattern.test(text)) {
    addIssue(
      issues,
      "blocker",
      "outside-atlas-category-focus",
      "Product type is outside the current ATLAS fashion and accessories focus.",
    );
  }

  if (product.photoCount !== null && product.photoCount < 4) {
    addIssue(
      issues,
      "blocker",
      "too-few-reference-photos",
      "Product has too few reference photos for storefront quality.",
    );
  }

  if (
    Number.isFinite(product.compareAtRon) &&
    Number.isFinite(product.priceRon) &&
    product.compareAtRon <= product.priceRon
  ) {
    addIssue(
      issues,
      "blocker",
      "invalid-compare-price",
      "Compare-at price must be higher than sale price.",
    );
  }

  if (category === "dresses" && footwearPattern.test(text)) {
    addIssue(
      issues,
      "blocker",
      "footwear-in-dresses",
      "Footwear text is categorized as dresses.",
      expectedFootwearCategory(text, audience, category),
    );
  }

  if (bagPattern.test(text) && category !== "bags") {
    addIssue(
      issues,
      "blocker",
      "bag-outside-bags",
      "Bag text is categorized outside bags.",
      "bags",
    );
  }

  if (watchPattern.test(text) && !watchCategories.has(category)) {
    addIssue(
      issues,
      "blocker",
      "watch-outside-watches",
      "Watch text is categorized outside watches.",
      audience === "men" ? "men-watches" : "watches",
    );
  }

  if (jewelleryPattern.test(text) && category !== "jewellery") {
    addIssue(
      issues,
      "blocker",
      "jewellery-outside-jewellery",
      "Jewellery text is categorized outside jewellery.",
      "jewellery",
    );
  }

  if (
    dressPattern.test(text) &&
    category !== "dresses" &&
    !dressExceptionPattern.test(text) &&
    !formalFootwearPattern.test(text)
  ) {
    addIssue(
      issues,
      "blocker",
      "dress-outside-dresses",
      "Dress text is categorized outside dresses.",
      "dresses",
    );
  }

  if (
    (heelPattern.test(text) || sandalPattern.test(text)) &&
    category !== "sandals" &&
    !bootPattern.test(text)
  ) {
    addIssue(
      issues,
      "blocker",
      "open-footwear-outside-sandals",
      "Heels, slides, or sandals are categorized outside sandals.",
      "sandals",
    );
  }

  if (bootPattern.test(text) && category !== "boots") {
    addIssue(
      issues,
      "blocker",
      "boot-outside-boots",
      "Boot text is categorized outside boots.",
      "boots",
    );
  }

  if (
    footwearPattern.test(text) &&
    !footwearCategories.has(category) &&
    category !== "accessories"
  ) {
    addIssue(
      issues,
      "blocker",
      "footwear-outside-footwear",
      "Footwear text is categorized outside footwear.",
      expectedFootwearCategory(text, audience, category),
    );
  }

  if (
    clothingPattern.test(text) &&
    footwearCategories.has(category) &&
    !footwearPattern.test(text)
  ) {
    addIssue(
      issues,
      "blocker",
      "clothing-in-footwear",
      "Clothing text is categorized as footwear.",
      "clothing",
    );
  }

  if (sunglassesPattern.test(text) && !accessoryCategories.has(category)) {
    addIssue(
      issues,
      "warning",
      "eyewear-outside-accessories",
      "Eyewear text is categorized outside accessories.",
      "sunglasses",
    );
  }

  if (hatPattern.test(text) && !accessoryCategories.has(category)) {
    addIssue(
      issues,
      "warning",
      "hat-outside-accessories",
      "Hat text is categorized outside hat/accessory categories.",
      "hats",
    );
  }

  return issues;
};

export const auditCatalogProducts = (products) => {
  const idCounts = new Map();

  for (const product of products) {
    const id = normalize(product.id);
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  }

  const duplicateIds = [...idCounts.entries()]
    .filter(([id, count]) => id && count > 1)
    .map(([id, count]) => ({ id, count }));

  const auditedProducts = products.map((product) => {
    const issues = auditCatalogProduct(product);

    if (duplicateIds.some((entry) => entry.id === product.id)) {
      addIssue(
        issues,
        "blocker",
        "duplicate-id",
        `Product id "${product.id}" appears multiple times.`,
      );
    }

    return {
      product,
      issues,
      blockers: issues.filter((issue) => issue.severity === "blocker"),
      warnings: issues.filter((issue) => issue.severity === "warning"),
    };
  });

  const approvedProducts = auditedProducts
    .filter((entry) => entry.blockers.length === 0)
    .map((entry) => entry.product);
  const reviewProducts = auditedProducts
    .filter((entry) => entry.blockers.length > 0)
    .map((entry) => ({
      ...entry.product,
      qualityIssues: entry.issues.map(compactIssue),
    }));
  const warningProducts = auditedProducts
    .filter((entry) => entry.blockers.length === 0 && entry.warnings.length > 0)
    .map((entry) => ({
      id: entry.product.id,
      name: entry.product.name,
      brand: entry.product.brand,
      category: entry.product.category,
      issues: entry.warnings.map(compactIssue),
    }));

  return {
    approvedProducts,
    reviewProducts,
    warningProducts,
    duplicateIds,
    summary: {
      total: products.length,
      approved: approvedProducts.length,
      quarantined: reviewProducts.length,
      warnings: warningProducts.length,
      duplicateIds: duplicateIds.length,
      byCategory: countByCategory(products),
      approvedByCategory: countByCategory(approvedProducts),
      quarantinedByCategory: countByCategory(reviewProducts),
    },
  };
};

export const buildQualityReport = ({
  sourceProducts,
  normalizedProducts,
  approvedProducts,
  reviewProducts,
  warningProducts,
  duplicateIds,
}) => ({
  sourceProducts: {
    total: sourceProducts.length,
  },
  normalizedProducts: {
    total: normalizedProducts.length,
    byCategory: countByCategory(normalizedProducts),
  },
  approvedProducts: {
    total: approvedProducts.length,
    byCategory: countByCategory(approvedProducts),
  },
  reviewProducts: {
    total: reviewProducts.length,
    byCategory: countByCategory(reviewProducts),
    examples: reviewProducts.slice(0, 50).map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      qualityIssues: product.qualityIssues,
    })),
  },
  warningProducts: {
    total: warningProducts.length,
    examples: warningProducts.slice(0, 50),
  },
  duplicateIds,
});
