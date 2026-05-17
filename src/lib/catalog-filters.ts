import type {
  SourceCategory,
  SourceProductAudience,
} from "@/data/source-products";
import type { CatalogProduct } from "@/lib/catalog";
import { localize, getLocalizedText, type Lang, type LocalizedText } from "@/lib/i18n";

export type CatalogUmbrella =
  | "footwear"
  | "bags"
  | "dresses"
  | "watches"
  | "accessories"
  | "clothing";

export interface CatalogUmbrellaOption {
  id: CatalogUmbrella;
  label: LocalizedText;
  categories: SourceCategory[];
}

export const catalogUmbrellaOptions: CatalogUmbrellaOption[] = [
  {
    id: "footwear",
    label: localize("Footwear", "Incaltaminte"),
    categories: ["sneakers", "sandals", "mules", "boots", "men-sneakers"],
  },
  {
    id: "bags",
    label: localize("Bags", "Genti"),
    categories: ["bags"],
  },
  {
    id: "dresses",
    label: localize("Dresses", "Rochii"),
    categories: ["dresses"],
  },
  {
    id: "watches",
    label: localize("Watches", "Ceasuri"),
    categories: ["watches", "men-watches"],
  },
  {
    id: "accessories",
    label: localize("Accessories", "Accesorii"),
    categories: [
      "accessories",
      "jewellery",
      "sunglasses",
      "hats",
      "caps",
    ],
  },
  {
    id: "clothing",
    label: localize("Clothing", "Imbracaminte"),
    categories: ["clothing", "polo-shirts", "hoodies", "jackets", "pants", "swimwear"],
  },
];

export const catalogUmbrellaMap = new Map(
  catalogUmbrellaOptions.map((option) => [option.id, option]),
);

export const normalizeCatalogUmbrella = (value: string | null) =>
  value && catalogUmbrellaMap.has(value as CatalogUmbrella)
    ? (value as CatalogUmbrella)
    : null;

export const getCatalogUmbrellaLabel = (
  umbrella: CatalogUmbrella,
  lang: Lang,
) => {
  const option = catalogUmbrellaMap.get(umbrella);

  return option ? getLocalizedText(option.label, lang) : umbrella;
};

export const getCatalogUmbrellaCategories = (umbrella: CatalogUmbrella) =>
  catalogUmbrellaMap.get(umbrella)?.categories ?? [];

export const isCategoryInCatalogUmbrella = (
  category: SourceCategory,
  umbrella: CatalogUmbrella,
) => getCatalogUmbrellaCategories(umbrella).includes(category);

export const matchesCatalogAudience = (
  productAudience: SourceProductAudience | undefined,
  activeAudience: SourceProductAudience | null,
) => {
  if (!activeAudience) {
    return true;
  }

  return productAudience === activeAudience || productAudience === "unisex";
};

export const filterCatalogProductsByNavigation = (
  products: CatalogProduct[],
  activeAudience: SourceProductAudience | null,
  activeCategory: SourceCategory | null,
  activeUmbrella: CatalogUmbrella | null,
) => {
  const audienceFiltered = activeAudience
    ? products.filter((product) =>
        matchesCatalogAudience(product.audience, activeAudience),
      )
    : products;

  if (activeCategory) {
    return audienceFiltered.filter(
      (product) => product.category === activeCategory,
    );
  }

  if (activeUmbrella) {
    const categories = getCatalogUmbrellaCategories(activeUmbrella);

    return audienceFiltered.filter((product) =>
      categories.includes(product.category),
    );
  }

  return audienceFiltered;
};
