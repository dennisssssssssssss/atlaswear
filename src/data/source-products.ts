import type { Category } from "@/data/products";
import { localize, type LocalizedText } from "@/lib/i18n";

export type SourceCategory = Category;
export type SourceProductSourceId =
  | "qiqiyg"
  | "weifeng"
  | "deshengxing"
  | "198maoyi";

export interface SourceProduct {
  id: string;
  name: string;
  brand: string;
  category: SourceCategory;
  source: SourceProductSourceId;
  href: string;
  image: string;
  photoCount: number | null;
  sizes: string[];
  sizeLabel: string;
  tags: string[];
  sourceCollection: LocalizedText;
  originalTitle: string;
}

const basePath =
  import.meta.env.BASE_URL === "/"
    ? ""
    : import.meta.env.BASE_URL.replace(/\/$/, "");

export const sourceProductsDataUrl = `${basePath}/source-data/source-products.json`;

export const sourceCategoryLabels: Record<SourceCategory, LocalizedText> = {
  dresses: localize("Dresses", "Rochii"),
  clothing: localize("Clothing", "Imbracaminte"),
  bags: localize("Bags", "Genti"),
  sneakers: localize("Sneakers", "Sneakers"),
  sandals: localize("Sandals", "Sandale"),
  mules: localize("Mules & Loafers", "Mules si loafers"),
  swimwear: localize("Swimwear", "Swimwear"),
  accessories: localize("Accessories", "Accesorii"),
  hats: localize("Hats", "Sepci"),
  watches: localize("Watches", "Ceasuri"),
  jewellery: localize("Jewellery", "Bijuterii"),
};
