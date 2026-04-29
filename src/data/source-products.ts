import type { Category } from "@/data/products";
import { localize, type LocalizedText } from "@/lib/i18n";

export type SourceCategory = Category;
export type SourceProductSourceId =
  | "qiqiyg"
  | "weifeng"
  | "deshengxing"
  | "198maoyi";
export type SourceProductAudience = "women" | "men" | "unisex";

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
  audience?: SourceProductAudience;
  sourcePriceRon?: number | null;
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
  boots: localize("Boots", "Ghete si cizme"),
  swimwear: localize("Swimwear", "Swimwear"),
  accessories: localize("Accessories", "Accesorii"),
  hats: localize("Hats", "Sepci"),
  watches: localize("Watches", "Ceasuri"),
  jewellery: localize("Jewellery", "Bijuterii"),
  "polo-shirts": localize("Polo Shirts", "Tricouri polo"),
  hoodies: localize("Hoodies", "Hanorace"),
  caps: localize("Caps", "Sepci"),
  sunglasses: localize("Sunglasses", "Ochelari de soare"),
  "men-sneakers": localize("Men Sneakers", "Sneakers barbati"),
  "men-watches": localize("Men Watches", "Ceasuri barbati"),
  jackets: localize("Jackets", "Jachete"),
  pants: localize("Pants", "Pantaloni"),
};
