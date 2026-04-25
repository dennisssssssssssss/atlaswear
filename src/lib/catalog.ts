import {
  sourceCategoryLabels,
  type SourceCategory,
  type SourceProduct,
} from "@/data/source-products";
import {
  getLocalizedText,
  localize,
  type Lang,
  type LocalizedText,
} from "@/lib/i18n";

export type CatalogSort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "brand-asc"
  | "name-asc";

export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: SourceCategory;
  description: LocalizedText;
  details: LocalizedText[];
  priceRon: number;
  compareAtRon: number;
  images: string[];
  imageFit: "contain" | "cover";
  sizes: string[];
  sizeLabel: string;
  featured: boolean;
  bestPrice: boolean;
  photoCount: number | null;
  sourceCollection: LocalizedText;
  collectionKey: string;
  originalTitle: string;
  relatedProductIds: string[];
}

export interface CatalogCategory {
  id: SourceCategory;
  label: LocalizedText;
  count: number;
  image: string;
}

export const catalogCategoryOrder: SourceCategory[] = [
  "dresses",
  "clothing",
  "bags",
  "sneakers",
  "sandals",
  "mules",
  "swimwear",
  "accessories",
  "hats",
  "watches",
  "jewellery",
];

const categoryBasePrices: Record<SourceCategory, number> = {
  dresses: 999,
  clothing: 549,
  bags: 1599,
  sneakers: 899,
  sandals: 699,
  mules: 749,
  swimwear: 449,
  accessories: 329,
  hats: 279,
  watches: 1299,
  jewellery: 299,
};

const compareMultipliers: Record<SourceCategory, number> = {
  dresses: 2.2,
  clothing: 2.0,
  bags: 2.6,
  sneakers: 2.4,
  sandals: 2.2,
  mules: 2.3,
  swimwear: 1.9,
  accessories: 2.1,
  hats: 1.9,
  watches: 2.5,
  jewellery: 2.1,
};

const bestPriceCaps: Record<SourceCategory, number> = {
  dresses: 1299,
  clothing: 699,
  bags: 2399,
  sneakers: 1099,
  sandals: 899,
  mules: 949,
  swimwear: 549,
  accessories: 399,
  hats: 329,
  watches: 1699,
  jewellery: 349,
};

const categoryNotes: Record<SourceCategory, LocalizedText> = {
  dresses: localize(
    "a polished dress wardrobe with occasion-ready silhouettes",
    "o selectie de rochii bine finisate, pentru tinute elegante si usor de purtat",
  ),
  clothing: localize(
    "an easy premium clothing rotation for everyday wear",
    "o selectie premium usor de purtat zi de zi",
  ),
  bags: localize(
    "a strong bag selection with practical day-to-evening appeal",
    "o selectie puternica de genti, usor de integrat de zi pana seara",
  ),
  sneakers: localize(
    "a versatile sneaker line for daily styling",
    "o selectie de sneakers versatila pentru purtare zilnica",
  ),
  sandals: localize(
    "warm-weather pairs with clean styling value",
    "perechi curate pentru sezonul cald si styling simplu",
  ),
  mules: localize(
    "refined flats and mules with a more classic finish",
    "mules si flats cu o directie mai clasica si rafinata",
  ),
  swimwear: localize(
    "a concise beach and resort selection",
    "o selectie compacta pentru plaja si resort",
  ),
  accessories: localize(
    "smaller accessories that finish an outfit cleanly",
    "accesorii mici care completeaza curat o tinuta",
  ),
  hats: localize(
    "caps and seasonal finishing pieces",
    "sepci si piese de sezon care completeaza tinuta",
  ),
  watches: localize(
    "statement watches with a stronger luxury presence",
    "ceasuri statement cu prezenta mai puternica",
  ),
  jewellery: localize(
    "elevated jewellery choices for daily styling",
    "bijuterii elegante pentru styling zilnic",
  ),
};

const brandMultipliers: Record<string, number> = {
  Hermes: 2.45,
  Chanel: 2.35,
  "Louis Vuitton": 2.15,
  Dior: 2.1,
  Prada: 1.95,
  Gucci: 1.9,
  Loewe: 1.85,
  "Saint Laurent": 1.9,
  "Miu Miu": 1.9,
  Zimmermann: 1.8,
  Celine: 1.8,
  Bottega: 1.85,
  "Bottega Veneta": 1.85,
  Fendi: 1.8,
  Valentino: 1.75,
  Burberry: 1.65,
  Balenciaga: 1.65,
  Ferragamo: 1.6,
  "Jimmy Choo": 1.65,
  "Roger Vivier": 1.7,
  "Alexander McQueen": 1.6,
  Versace: 1.55,
  UGG: 1.2,
  Birkenstock: 1.15,
  Adidas: 1.1,
  Nike: 1.1,
  "ATLAS Selection": 1.18,
};

const genericBrands = new Set(["Designer", "Unknown", ""]);

const cleanDisplayText = (value: string) =>
  value
    .replace(/ï¿½/g, " ")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\b\d{2,}\s*-\s*\d{2,}\b/g, " ")
    .replace(/\b\d{6,}\b/g, " ")
    .replace(/\b1\s*:\s*1\b/gi, " ")
    .replace(/\b[a-z]{2,5}\s*\d{2,5}\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const getDisplayBrand = (product: SourceProduct) => {
  const cleaned = cleanDisplayText(product.brand);
  return genericBrands.has(cleaned) ? "ATLAS Selection" : cleaned;
};

const categoryNouns: Record<SourceCategory, LocalizedText> = {
  dresses: localize("Dress", "Rochie"),
  clothing: localize("Piece", "Piesa"),
  bags: localize("Bag", "Geanta"),
  sneakers: localize("Sneaker", "Sneaker"),
  sandals: localize("Sandal", "Sandala"),
  mules: localize("Mule", "Mule"),
  swimwear: localize("Swimwear", "Swimwear"),
  accessories: localize("Accessory", "Accesoriu"),
  hats: localize("Hat", "Sapca"),
  watches: localize("Watch", "Ceas"),
  jewellery: localize("Jewellery", "Bijuterie"),
};

const getDisplayName = (product: SourceProduct, brand: string) => {
  const rawName = cleanDisplayText(product.name);
  const rawTitle = cleanDisplayText(product.originalTitle);
  const categoryNoun = getLocalizedText(categoryNouns[product.category], "en");

  const candidate = [rawName, rawTitle]
    .filter(Boolean)
    .map((value) => value.replace(new RegExp(brand, "ig"), "").trim())
    .find((value) => value && !/^ATLAS Selection/i.test(value));

  if (candidate && !/^Designer\b/i.test(candidate)) {
    return candidate;
  }

  return brand === "ATLAS Selection"
    ? `ATLAS ${categoryNoun}`
    : `${brand} ${categoryNoun}`;
};

const roundRetailPrice = (value: number) => {
  const rounded = Math.round(value / 10) * 10 - 1;
  return Math.max(199, rounded);
};

const getBrandMultiplier = (brand: string) => {
  return brandMultipliers[brand] ?? 1.28;
};

const getPhotoMultiplier = (photoCount: number | null) => {
  if (!photoCount) {
    return 1;
  }

  if (photoCount >= 80) {
    return 1.14;
  }

  if (photoCount >= 40) {
    return 1.08;
  }

  if (photoCount >= 20) {
    return 1.04;
  }

  return 0.98;
};

const getSizeMultiplier = (product: SourceProduct) => {
  if (product.sizes.length >= 5) {
    return 1.04;
  }

  if (product.sizes.length > 0 || product.sizeLabel) {
    return 1.02;
  }

  return 1;
};

const getImageFit = (category: SourceCategory) => {
  return category === "accessories" ||
    category === "hats" ||
    category === "watches" ||
    category === "jewellery"
    ? "contain"
    : "cover";
};

const buildDescription = (
  product: SourceProduct,
  brand: string,
  displayName: string,
) => {
  const note = categoryNotes[product.category];

  return localize(
    `${brand} ${displayName} is part of the ATLAS women selection, offered brand new and prepared for direct order. It was chosen for ${note.en}.`,
    `${brand} ${displayName} face parte din selectia ATLAS pentru femei, este oferit nou si pregatit pentru comanda directa. A fost ales pentru ${note.ro}.`,
  );
};

const buildDetails = (product: SourceProduct) => {
  const details = [
    localize(
      "100% authentic, brand new, and checked before dispatch",
      "100% autentic, nou si verificat inainte de livrare",
    ),
    localize(
      "Direct WhatsApp ordering and availability confirmation",
      "Comanda directa pe WhatsApp si confirmare de disponibilitate",
    ),
  ];

  if (product.sizes.length > 0 || product.sizeLabel) {
    details.push(
      localize(
        "Size options confirmed individually before order placement",
        "Optiunile de marime se confirma individual inainte de plasarea comenzii",
      ),
    );
  }

  if (product.photoCount && product.photoCount > 12) {
    details.push(
      localize(
        `${product.photoCount} reference photos available for review`,
        `${product.photoCount} poze de referinta disponibile pentru verificare`,
      ),
    );
  }

  return details;
};

export const mapSourceProductToCatalogProduct = (
  product: SourceProduct,
): CatalogProduct => {
  const brand = getDisplayBrand(product);
  const name = getDisplayName(product, brand);
  const priceRon = roundRetailPrice(
    categoryBasePrices[product.category] *
      getBrandMultiplier(brand) *
      getPhotoMultiplier(product.photoCount) *
      getSizeMultiplier(product),
  );
  const compareAtRon = roundRetailPrice(
    priceRon * compareMultipliers[product.category],
  );
  const collectionKey = [
    product.category,
    brand,
    getLocalizedText(product.sourceCollection, "en"),
  ].join("::");

  return {
    id: product.id,
    name,
    brand,
    category: product.category,
    description: buildDescription(product, brand, name),
    details: buildDetails(product),
    priceRon,
    compareAtRon,
    images: [product.image],
    imageFit: getImageFit(product.category),
    sizes: product.sizes,
    sizeLabel: product.sizeLabel,
    featured:
      product.photoCount !== null
        ? product.photoCount >= 24
        : brand !== "ATLAS Selection",
    bestPrice: priceRon <= bestPriceCaps[product.category],
    photoCount: product.photoCount,
    sourceCollection: product.sourceCollection,
    collectionKey,
    originalTitle: product.originalTitle,
    relatedProductIds: [],
  };
};

export const attachRelatedProducts = (
  products: CatalogProduct[],
): CatalogProduct[] => {
  const collectionGroups = new Map<string, string[]>();
  const brandGroups = new Map<string, string[]>();

  products.forEach((product) => {
    const collectionEntries = collectionGroups.get(product.collectionKey) ?? [];
    collectionEntries.push(product.id);
    collectionGroups.set(product.collectionKey, collectionEntries);

    const brandEntries =
      brandGroups.get(`${product.category}::${product.brand}`) ?? [];
    brandEntries.push(product.id);
    brandGroups.set(`${product.category}::${product.brand}`, brandEntries);
  });

  return products.map((product) => {
    const collectionMatches = (collectionGroups.get(product.collectionKey) ?? [])
      .filter((id) => id !== product.id)
      .slice(0, 4);
    const relatedProductIds =
      collectionMatches.length > 0
        ? collectionMatches
        : (brandGroups.get(`${product.category}::${product.brand}`) ?? [])
            .filter((id) => id !== product.id)
            .slice(0, 4);

    return {
      ...product,
      relatedProductIds,
    };
  });
};

export const buildCatalogCategories = (
  products: CatalogProduct[],
): CatalogCategory[] => {
  return catalogCategoryOrder
    .map((categoryId) => {
      const categoryProducts = products.filter(
        (product) => product.category === categoryId,
      );

      if (categoryProducts.length === 0) {
        return null;
      }

      const heroProduct =
        categoryProducts.find((product) => product.featured) ?? categoryProducts[0];

      return {
        id: categoryId,
        label: sourceCategoryLabels[categoryId],
        count: categoryProducts.length,
        image: heroProduct.images[0],
      };
    })
    .filter((category): category is CatalogCategory => category !== null);
};

export const getCatalogCategoryLabel = (categoryId: SourceCategory, lang: Lang) =>
  getLocalizedText(sourceCategoryLabels[categoryId], lang);

export const searchCatalogProducts = (
  products: CatalogProduct[],
  query: string,
  lang: Lang,
) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) => {
    const categoryLabel = getCatalogCategoryLabel(product.category, lang).toLowerCase();
    const collectionLabel = getLocalizedText(product.sourceCollection, lang).toLowerCase();

    return [
      product.name,
      product.brand,
      product.originalTitle,
      categoryLabel,
      collectionLabel,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
  });
};

export const sortCatalogProducts = (
  products: CatalogProduct[],
  sort: CatalogSort,
) => {
  const sorted = [...products];

  sorted.sort((left, right) => {
    switch (sort) {
      case "price-asc":
        return left.priceRon - right.priceRon;
      case "price-desc":
        return right.priceRon - left.priceRon;
      case "brand-asc":
        return left.brand.localeCompare(right.brand) || left.name.localeCompare(right.name);
      case "name-asc":
        return left.name.localeCompare(right.name) || left.brand.localeCompare(right.brand);
      case "featured":
      default:
        if (left.featured !== right.featured) {
          return left.featured ? -1 : 1;
        }
        if (left.bestPrice !== right.bestPrice) {
          return left.bestPrice ? -1 : 1;
        }
        if ((right.photoCount ?? 0) !== (left.photoCount ?? 0)) {
          return (right.photoCount ?? 0) - (left.photoCount ?? 0);
        }
        return left.priceRon - right.priceRon;
    }
  });

  return sorted;
};
