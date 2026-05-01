import {
  sourceCategoryLabels,
  type SourceCategory,
  type SourceProduct,
} from "@/data/source-products";
import type { Product } from "@/data/products";
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
  "polo-shirts",
  "hoodies",
  "caps",
  "sunglasses",
  "men-sneakers",
  "men-watches",
  "jackets",
  "pants",
];

const categoryPriceBands: Record<SourceCategory, [number, number]> = {
  dresses: [149, 499],
  clothing: [89, 289],
  bags: [249, 899],
  sneakers: [199, 549],
  sandals: [149, 399],
  mules: [169, 449],
  boots: [229, 599],
  swimwear: [89, 229],
  accessories: [39, 199],
  hats: [49, 149],
  watches: [199, 699],
  jewellery: [49, 249],
  "polo-shirts": [149, 349],
  hoodies: [249, 599],
  caps: [89, 249],
  sunglasses: [149, 699],
  "men-sneakers": [299, 1199],
  "men-watches": [699, 3999],
  jackets: [299, 899],
  pants: [149, 499],
};

const compareMultipliers: Record<SourceCategory, number> = {
  dresses: 1.75,
  clothing: 1.65,
  bags: 1.9,
  sneakers: 1.75,
  sandals: 1.65,
  mules: 1.7,
  boots: 1.75,
  swimwear: 1.55,
  accessories: 1.6,
  hats: 1.5,
  watches: 1.85,
  jewellery: 1.65,
  "polo-shirts": 1.65,
  hoodies: 1.7,
  caps: 1.55,
  sunglasses: 1.7,
  "men-sneakers": 1.75,
  "men-watches": 1.9,
  jackets: 1.75,
  pants: 1.65,
};

const bestPriceCaps: Record<SourceCategory, number> = {
  dresses: 349,
  clothing: 199,
  bags: 599,
  sneakers: 399,
  sandals: 299,
  mules: 329,
  boots: 449,
  swimwear: 179,
  accessories: 129,
  hats: 99,
  watches: 449,
  jewellery: 149,
  "polo-shirts": 249,
  hoodies: 399,
  caps: 179,
  sunglasses: 399,
  "men-sneakers": 699,
  "men-watches": 2499,
  jackets: 599,
  pants: 299,
};

const featuredCategoryPriority: Record<SourceCategory, number> = {
  dresses: 0,
  bags: 1,
  sneakers: 2,
  clothing: 3,
  sandals: 4,
  mules: 5,
  boots: 6,
  watches: 7,
  jewellery: 8,
  swimwear: 9,
  accessories: 10,
  hats: 11,
  "men-sneakers": 12,
  "polo-shirts": 13,
  hoodies: 14,
  jackets: 15,
  pants: 16,
  caps: 17,
  sunglasses: 18,
  "men-watches": 19,
};

const storefrontFeaturedCategories = new Set<SourceCategory>([
  "dresses",
  "bags",
  "sneakers",
  "clothing",
  "sandals",
  "mules",
  "boots",
  "watches",
  "jewellery",
  "men-sneakers",
  "polo-shirts",
  "hoodies",
  "jackets",
  "pants",
  "caps",
  "sunglasses",
  "men-watches",
]);

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
  "polo-shirts": localize(
    "classic polo styles with strong everyday demand",
    "tricouri polo clasice, cu cerere buna pentru purtare zilnica",
  ),
  hoodies: localize(
    "premium hoodies with strong streetwear appeal",
    "hanorace premium cu appeal puternic streetwear",
  ),
  caps: localize(
    "caps that finish casual outfits cleanly",
    "sepci care completeaza curat tinutele casual",
  ),
  sunglasses: localize(
    "sunglasses with a polished designer finish",
    "ochelari de soare cu finisaj designer curat",
  ),
  "men-sneakers": localize(
    "men's sneakers with high daily demand",
    "sneakers pentru barbati cu cerere mare de zi cu zi",
  ),
  "men-watches": localize(
    "men's watches with a stronger luxury presence",
    "ceasuri pentru barbati cu prezenta luxury mai puternica",
  ),
  jackets: localize(
    "outerwear pieces with practical premium value",
    "piese outerwear cu valoare premium practica",
  ),
  pants: localize(
    "pants selected for clean everyday styling",
    "pantaloni selectati pentru styling curat de zi cu zi",
  ),
};

const brandMultipliers: Record<string, number> = {
  Hermes: 1.14,
  Chanel: 1.13,
  "Louis Vuitton": 1.1,
  Dior: 1.09,
  Prada: 1.06,
  Gucci: 1.06,
  Loewe: 1.05,
  "Saint Laurent": 1.05,
  "Miu Miu": 1.04,
  Zimmermann: 1.04,
  Celine: 1.04,
  Bottega: 1.04,
  "Bottega Veneta": 1.04,
  Fendi: 1.04,
  Valentino: 1.03,
  Burberry: 1.03,
  Balenciaga: 1.03,
  Ferragamo: 1.03,
  "Jimmy Choo": 1.03,
  "Roger Vivier": 1.03,
  "Alexander McQueen": 1.03,
  Versace: 1.03,
  UGG: 1.01,
  Birkenstock: 1,
  HOKA: 1,
  "New Balance": 1,
  Adidas: 1,
  Nike: 1,
  "Ralph Lauren": 1,
  Lacoste: 1,
  Lululemon: 1,
  ALO: 1,
  "Juicy Couture": 0.98,
  Coach: 1,
  "Michael Kors": 0.98,
  "Marc Jacobs": 0.99,
  "Tory Burch": 1,
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
    .replace(/\b[a-z]{2,5}\d{2,5}\b/gi, " ")
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
  "polo-shirts": localize("Polo Shirt", "Tricou polo"),
  hoodies: localize("Hoodie", "Hanorac"),
  caps: localize("Cap", "Sapca"),
  sunglasses: localize("Sunglasses", "Ochelari de soare"),
  "men-sneakers": localize("Sneaker", "Sneaker"),
  "men-watches": localize("Watch", "Ceas"),
  jackets: localize("Jacket", "Jacheta"),
  pants: localize("Pants", "Pantaloni"),
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
  return brandMultipliers[brand] ?? 1.02;
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

const footwearCategories = new Set<SourceCategory>([
  "sneakers",
  "men-sneakers",
  "sandals",
  "mules",
  "boots",
]);

const refineAudienceFromText = (
  audience: SourceProduct["audience"],
  text: string,
): SourceProduct["audience"] => {
  if (/\b(women|women's|woman|female|dama|femei)\b|35-41|35-40|36-41/.test(text)) {
    return "women";
  }

  if (/\b(men|men's|man|male|barbati|bărbați)\b|38-46|39-45|40-46|41-46/.test(text)) {
    return "men";
  }

  return audience ?? "unisex";
};

const hasFootwearText = (text: string) =>
  /shoe|sneaker|trainer|runner|loafer|oxford|derby|moccasin|monk|brogue|boot|chelsea|sandal|slide|flip|heel|pump|stiletto|mule|flat/.test(
    text,
  );

const hasBagText = (text: string) =>
  /bag|backpack|tote|purse|handbag|hobo|shoulder|satchel|puzzle|flamenco|handle|clutch|pochette|bucket|crossbody|manhattan|nolita/.test(
    text,
  );

const getContextCategory = (context: string): SourceCategory | null => {
  if (/\bbags?\b|\bgenti\b/.test(context)) {
    return "bags";
  }

  if (/jewellery|jewelry|bijuterii/.test(context)) {
    return "jewellery";
  }

  if (/watch|watches|ceasuri/.test(context)) {
    return "watches";
  }

  if (
    /\b(?:glasses|sunglasses|belts?|scarves?|perfume|gloves?|ties?|socks?)\b|ochelari|curele|esarfe|parfum|manusi|cravate|sosete|hair accessories|accesorii par/.test(
      context,
    )
  ) {
    return "accessories";
  }

  if (/\b(?:caps?|hats?|bucket hats?|more hats?)\b|sepci/.test(context)) {
    return "hats";
  }

  return null;
};

const getFootwearCategory = (
  text: string,
  audience: SourceProduct["audience"],
  fallbackCategory: SourceCategory,
): SourceCategory => {
  if (/boot|chelsea|ugg|anacapa/.test(text)) {
    return "boots";
  }

  if (/sandal|slide|flip|heel|pump|stiletto|slipper/.test(text)) {
    return "sandals";
  }

  if (/mule|loafer|oxford|derby|moccasin|monk|brogue|flat|ballet|boston/.test(text)) {
    return audience === "men" || audience === "unisex" ? "men-sneakers" : "mules";
  }

  if (footwearCategories.has(fallbackCategory) && fallbackCategory !== "dresses") {
    return fallbackCategory;
  }

  return audience === "men" || audience === "unisex" ? "men-sneakers" : "sneakers";
};

const normalizeCatalogCategory = (product: SourceProduct): SourceCategory => {
  const text = cleanDisplayText(`${product.originalTitle} ${product.name}`).toLowerCase();
  const context = cleanDisplayText(
    `${product.href} ${getLocalizedText(product.sourceCollection, "en")} ${getLocalizedText(
      product.sourceCollection,
      "ro",
    )}`,
  ).toLowerCase();
  const combinedText = `${text} ${context}`;
  const audience = refineAudienceFromText(product.audience, combinedText);
  const contextCategory = getContextCategory(context);

  if (contextCategory === "bags" || hasBagText(text)) {
    return "bags";
  }

  if (contextCategory && !hasFootwearText(text)) {
    return contextCategory;
  }

  if (hasFootwearText(text) || hasFootwearText(context) || footwearCategories.has(product.category)) {
    return getFootwearCategory(combinedText, audience, product.category);
  }

  if (/bikini|swim/.test(text)) {
    return "swimwear";
  }

  if (/\b(bucket hat|hat|cap|caps|beanie)\b/.test(text)) {
    return "hats";
  }

  if (/watch/.test(text)) {
    return "watches";
  }

  if (/jewelry|jewellery|bracelet|\bring\b|earring|necklace/.test(text)) {
    return "jewellery";
  }

  if (/\bdress\b|gown|skirt|\bmidi\b|\bmini dress\b/.test(text)) {
    return "dresses";
  }

  if (/\bt[-\s]?shirt\b|\btee\b|\bshirt\b|\bjacket\b|\bcoat\b|\bhoodie\b|\bpants\b|\bshorts\b/.test(text)) {
    return "clothing";
  }

  if (/scarf|belt|glasses|sunglasses|hair|perfume|gloves|tie|socks/.test(text)) {
    return "accessories";
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
      priceRon: roundRetailPrice(sourcePriceRon * 1.25 + 29),
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
      storefrontFeaturedCategories.has(category) &&
      (product.photoCount !== null
        ? product.photoCount >= 24
        : brand !== "ATLAS Selection"),
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

export const mapProductToCatalogProduct = (product: Product): CatalogProduct => {
  const collectionLabel = localize("ATLAS Curated Catalog", "Catalog curatat ATLAS");

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    description: product.description,
    details: product.details,
    priceRon: product.priceRon,
    compareAtRon: product.compareAtRon ?? roundRetailPrice(product.priceRon * 1.75),
    images: product.images,
    imageFit: product.imageFit,
    sizes: product.sizes,
    sizeLabel: product.sizes.join(", "),
    featured: product.featured,
    bestPrice: product.bestPrice,
    photoCount: product.images.length || null,
    sourceCollection: collectionLabel,
    collectionKey: [product.category, product.brand, "ATLAS Curated Catalog"].join("::"),
    originalTitle: product.name,
    relatedProductIds: [],
    audience: product.audience,
    sourcePriceRon: null,
    priceConfidence: "estimated",
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
        if (featuredCategoryPriority[left.category] !== featuredCategoryPriority[right.category]) {
          return featuredCategoryPriority[left.category] - featuredCategoryPriority[right.category];
        }
        if ((right.photoCount ?? 0) !== (left.photoCount ?? 0)) {
          return (right.photoCount ?? 0) - (left.photoCount ?? 0);
        }
        return left.priceRon - right.priceRon;
    }
  });

  return sorted;
};
