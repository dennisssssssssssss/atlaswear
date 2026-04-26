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
  audience: SourceProduct["audience"];
  sourcePriceRon: number | null;
  priceConfidence: "source" | "estimated";
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
  "boots",
  "swimwear",
  "accessories",
  "hats",
  "watches",
  "jewellery",
];

const categoryPriceBands: Record<SourceCategory, [number, number]> = {
  dresses: [279, 849],
  clothing: [169, 499],
  bags: [499, 1599],
  sneakers: [329, 849],
  sandals: [249, 599],
  mules: [299, 699],
  boots: [399, 899],
  swimwear: [149, 329],
  accessories: [89, 329],
  hats: [99, 229],
  watches: [399, 1099],
  jewellery: [79, 249],
};

const compareMultipliers: Record<SourceCategory, number> = {
  dresses: 2.2,
  clothing: 2.0,
  bags: 2.6,
  sneakers: 2.4,
  sandals: 2.2,
  mules: 2.3,
  boots: 2.2,
  swimwear: 1.9,
  accessories: 2.1,
  hats: 1.9,
  watches: 2.5,
  jewellery: 2.1,
};

const bestPriceCaps: Record<SourceCategory, number> = {
  dresses: 649,
  clothing: 399,
  bags: 1199,
  sneakers: 649,
  sandals: 449,
  mules: 499,
  boots: 649,
  swimwear: 249,
  accessories: 199,
  hats: 169,
  watches: 799,
  jewellery: 169,
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
  boots: localize(
    "boots and cold-weather pairs with practical everyday value",
    "ghete si cizme cu valoare practica pentru purtare zilnica",
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
  Hermes: 1.32,
  Chanel: 1.3,
  "Louis Vuitton": 1.24,
  Dior: 1.23,
  Prada: 1.18,
  Gucci: 1.16,
  Loewe: 1.14,
  "Saint Laurent": 1.14,
  "Miu Miu": 1.12,
  Zimmermann: 1.1,
  Celine: 1.1,
  Bottega: 1.12,
  "Bottega Veneta": 1.12,
  Fendi: 1.1,
  Valentino: 1.09,
  Burberry: 1.08,
  Balenciaga: 1.08,
  Ferragamo: 1.08,
  "Jimmy Choo": 1.08,
  "Roger Vivier": 1.09,
  "Alexander McQueen": 1.08,
  Versace: 1.07,
  UGG: 1.03,
  Birkenstock: 1.02,
  HOKA: 1.03,
  "New Balance": 1,
  Adidas: 1,
  Nike: 1,
  "ATLAS Selection": 1,
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
  boots: localize("Boot", "Gheata"),
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

const hashToUnit = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) / 4294967295;
};

const roundRetailPrice = (value: number) => {
  const rounded = Math.round(value / 10) * 10 - 1;
  return Math.max(79, rounded);
};

const extractSourcePriceRon = (product: SourceProduct) => {
  if (typeof product.sourcePriceRon === "number" && product.sourcePriceRon > 0) {
    return product.sourcePriceRon;
  }

  const text = `${product.originalTitle} ${product.name}`;
  const currencyMatch = text.match(
    /(?:¥|￥|RMB|CNY|yuan|元)\s*(\d{2,5})|(\d{2,5})\s*(?:RMB|CNY|yuan|元)/i,
  );

  if (!currencyMatch) {
    return null;
  }

  const cnyPrice = Number(currencyMatch[1] ?? currencyMatch[2]);

  if (!Number.isFinite(cnyPrice) || cnyPrice <= 0) {
    return null;
  }

  return Math.round(cnyPrice * 0.65);
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

const normalizeCatalogCategory = (product: SourceProduct): SourceCategory => {
  const text = cleanDisplayText(`${product.originalTitle} ${product.name}`).toLowerCase();

  if (/\bt[-\s]?shirt\b|\btee\b|\bshirt\b|\bjacket\b|\bcoat\b|\bhoodie\b|\bpants\b|\bshorts\b/.test(text)) {
    return "clothing";
  }

  if (
    /manhattan|bag|hobo|tote|shoulder|satchel|puzzle|flamenco|handle|clutch|pochette|bucket|crossbody/.test(
      text,
    )
  ) {
    return "bags";
  }

  if (/boot|boots|hoka|anacapa/.test(text)) {
    return "boots";
  }

  if (/mule|loafer|flat|ballet|boston/.test(text)) {
    return "mules";
  }

  if (/sandal|slide|heel|pump|slipper/.test(text)) {
    return "sandals";
  }

  if (/sneaker|trainer|runner|sport|530|574|327|shoe/.test(text)) {
    return "sneakers";
  }

  if (/\b(hat|cap|caps|beanie)\b/.test(text)) {
    return "hats";
  }

  return product.category;
};

const getAccessiblePrice = (
  product: SourceProduct,
  brand: string,
  category: SourceCategory,
) => {
  const sourcePriceRon = extractSourcePriceRon(product);

  if (sourcePriceRon) {
    return {
      priceRon: roundRetailPrice(sourcePriceRon * 1.35 + 39),
      sourcePriceRon,
      priceConfidence: "source" as const,
    };
  }

  const [minPrice, maxPrice] = categoryPriceBands[category];
  const seed = hashToUnit(`${product.id}:${product.originalTitle}:${product.image}`);
  const bandPrice = minPrice + (maxPrice - minPrice) * seed;
  const photoAdjustment = 0.92 + getPhotoMultiplier(product.photoCount) * 0.08;
  const priceRon = roundRetailPrice(
    bandPrice *
      getBrandMultiplier(brand) *
      photoAdjustment *
      getSizeMultiplier(product),
  );

  return {
    priceRon,
    sourcePriceRon: null,
    priceConfidence: "estimated" as const,
  };
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
  const category = normalizeCatalogCategory(product);
  const note = categoryNotes[category];

  return localize(
    `${brand} ${displayName} is part of the ATLAS authentic product selection, offered brand new and prepared for direct order. It was chosen for ${note.en}.`,
    `${brand} ${displayName} face parte din selectia ATLAS de produse autentice, este oferit nou si pregatit pentru comanda directa. A fost ales pentru ${note.ro}.`,
  );
};

const buildDetails = (product: SourceProduct) => {
  const details = [
    localize(
      "100% authentic, brand new, and checked before dispatch",
      "100% autentic, nou si verificat inainte de livrare",
    ),
    localize(
      "Direct message ordering and availability confirmation",
      "Comanda directa prin mesaj si confirmare de disponibilitate",
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
  const category = normalizeCatalogCategory(product);
  const { priceRon, sourcePriceRon, priceConfidence } = getAccessiblePrice(
    product,
    brand,
    category,
  );
  const compareAtRon = roundRetailPrice(
    priceRon * compareMultipliers[category],
  );
  const collectionKey = [
    category,
    brand,
    getLocalizedText(product.sourceCollection, "en"),
  ].join("::");

  return {
    id: product.id,
    name,
    brand,
    category,
    description: buildDescription(product, brand, name),
    details: buildDetails(product),
    priceRon,
    compareAtRon,
    images: [product.image],
    imageFit: getImageFit(category),
    sizes: product.sizes,
    sizeLabel: product.sizeLabel,
    featured:
      product.photoCount !== null
        ? product.photoCount >= 24
        : brand !== "ATLAS Selection",
    bestPrice: priceRon <= bestPriceCaps[category],
    photoCount: product.photoCount,
    sourceCollection: product.sourceCollection,
    collectionKey,
    originalTitle: product.originalTitle,
    relatedProductIds: [],
    audience: product.audience ?? "women",
    sourcePriceRon,
    priceConfidence,
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
