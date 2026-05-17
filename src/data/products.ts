import {
  getLocalizedText,
  localize,
  type Lang,
  type LocalizedText,
} from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { resolveAssetUrl } from "@/lib/assets";
import type { CatalogProduct } from "@/lib/catalog";

export { getLocalizedText } from "@/lib/i18n";

export type Category =
  | "dresses"
  | "clothing"
  | "bags"
  | "sneakers"
  | "sandals"
  | "mules"
  | "boots"
  | "swimwear"
  | "accessories"
  | "hats"
  | "watches"
  | "jewellery"
  | "polo-shirts"
  | "hoodies"
  | "caps"
  | "sunglasses"
  | "men-sneakers"
  | "men-watches"
  | "jackets"
  | "pants";

export interface ProductColor {
  id: string;
  name: LocalizedText;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  audience: "men" | "women" | "unisex";
  description: LocalizedText;
  details: LocalizedText[];
  priceRon: number;
  compareAtRon?: number;
  images: string[];
  imageFit: "contain" | "cover";
  sizes: string[];
  colors: ProductColor[];
  featured: boolean;
  isNewArrival: boolean;
  bestPrice: boolean;
  addedAt: string;
  authentic: true;
  sealed: true;
}

export interface ProductCategory {
  id: Category;
  label: LocalizedText;
  image: string;
}

const catalog = (fileName: string) => resolveAssetUrl(`/catalog/${fileName}`);

const basePath =
  import.meta.env.BASE_URL === "/"
    ? ""
    : import.meta.env.BASE_URL.replace(/\/$/, "");

export const productsDataUrl = `${basePath}/data/products.json`;
export const productsQueryKey = ["products"];


export const categories: ProductCategory[] = [
  {
    id: "dresses",
    label: localize("Dresses", "Rochii"),
    image: catalog("zimmermann-blossom-corset-midi.jpg"),
  },
  {
    id: "clothing",
    label: localize("Clothing", "Imbracaminte"),
    image: catalog("miumiu-polo-skirt-set.jpg"),
  },
  {
    id: "bags",
    label: localize("Bags", "Posete"),
    image: catalog("prada-bonnie-buckle-tote.jpg"),
  },
  {
    id: "sneakers",
    label: localize("Sneakers", "Sneakers"),
    image: catalog("lv-time-out-blush-sneaker.jpg"),
  },
  {
    id: "sandals",
    label: localize("Sandals", "Sandale"),
    image: catalog("gucci-double-g-slide-white.jpg"),
  },
  {
    id: "mules",
    label: localize("Mules & Loafers", "Mules si loafers"),
    image: catalog("gucci-horsebit-mule-oxblood.jpg"),
  },
  {
    id: "boots",
    label: localize("Boots", "Ghete si cizme"),
    image: catalog("hermes-kelly-slide-black.jpg"),
  },
  {
    id: "swimwear",
    label: localize("Swimwear", "Swimwear"),
    image: catalog("zimmermann-scarlet-organza-mini.jpg"),
  },
  {
    id: "accessories",
    label: localize("Accessories", "Accesorii"),
    image: catalog("lv-sneakerina-ballet-sneaker.jpg"),
  },
  {
    id: "hats",
    label: localize("Hats", "Sepci"),
    image: catalog("miumiu-polo-skirt-set.jpg"),
  },
  {
    id: "watches",
    label: localize("Watches", "Ceasuri"),
    image: catalog("prada-bonnie-buckle-tote.jpg"),
  },
  {
    id: "jewellery",
    label: localize("Jewellery", "Bijuterii"),
    image: catalog("loewe-flamenco-soft-bag.jpg"),
  },
];

export const categoryMap = new Map(categories.map((category) => [category.id, category]));

export const fetchProducts = async () => {
  const response = await fetch(productsDataUrl);

  if (!response.ok) {
    throw new Error(`Failed to load product catalog: ${response.status}`);
  }

  return response.json() as Promise<CatalogProduct[]>;
};

export const useProducts = () =>
  useQuery<CatalogProduct[]>({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 15,
  });

export const getProductPrice = (product: Product) => product.priceRon;

export const getProductCompareAt = (product: Product) => product.compareAtRon;

export const getProductColor = (product: Product, colorId: string) =>
  product.colors.find((entry) => entry.id === colorId);

export const getProductColorLabel = (
  product: Product,
  colorId: string,
  lang: Lang,
) => {
  const entry = getProductColor(product, colorId);
  return entry ? getLocalizedText(entry.name, lang) : colorId;
};

export const getCategoryLabel = (categoryId: Category, lang: Lang) => {
  const category = categoryMap.get(categoryId);
  return category ? getLocalizedText(category.label, lang) : categoryId;
};

export const searchProducts = (entries: Product[], query: string, lang: Lang) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return entries;
  }

  return entries.filter((product) => {
    const categoryLabel = getCategoryLabel(product.category, lang).toLowerCase();

    return [product.name, product.brand, categoryLabel].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    );
  });
};
