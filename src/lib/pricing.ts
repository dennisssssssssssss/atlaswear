export const USD_TO_RON = 4.6;
export const MARGIN = 1.55;
export const COMPARE_MULTIPLIER = 2.4;

export function calcPriceRon(costUsd: number): number {
  return Math.round(costUsd * USD_TO_RON * MARGIN / 10) * 10;
}

export function calcCompareAtRon(priceRon: number): number {
  return Math.round(priceRon * COMPARE_MULTIPLIER / 10) * 10;
}

type BrandTier = "accessible" | "mid-luxury" | "luxury";

export const BRAND_TIERS: Record<string, BrandTier> = {
  "Nike": "accessible", "Adidas": "accessible", "Jordan": "accessible",
  "Lacoste": "accessible", "Ralph Lauren": "accessible",
  "New Balance": "accessible", "Puma": "accessible",
  "Off-White": "mid-luxury", "Stone Island": "mid-luxury",
  "Moncler": "mid-luxury", "Versace": "mid-luxury",
  "Balenciaga": "mid-luxury", "Burberry": "mid-luxury",
  "Gucci": "luxury", "Prada": "luxury", "Louis Vuitton": "luxury",
  "Saint Laurent": "luxury", "Hermès": "luxury", "Loewe": "luxury",
  "Zimmermann": "luxury", "Miu Miu": "luxury", "Dior": "luxury",
  "Chanel": "luxury", "Rolex": "luxury", "Audemars Piguet": "luxury",
};

const ESTIMATED_PRICES: Record<BrandTier, Partial<Record<string, number>>> = {
  "accessible": {
    "clothing": 220, "polo-shirts": 200, "hoodies": 280, "jackets": 350,
    "pants": 230, "men-sneakers": 420, "sneakers": 380, "caps": 160,
    "sunglasses": 200, "accessories": 180, "men-watches": 350,
  },
  "mid-luxury": {
    "clothing": 550, "polo-shirts": 480, "hoodies": 600, "jackets": 750,
    "pants": 500, "men-sneakers": 780, "sneakers": 720, "caps": 320,
    "sunglasses": 400, "bags": 900, "accessories": 380, "men-watches": 900,
  },
  "luxury": {
    "clothing": 900, "polo-shirts": 800, "hoodies": 950, "jackets": 1200,
    "pants": 850, "men-sneakers": 1100, "sneakers": 1100, "sandals": 900,
    "mules": 1000, "bags": 2200, "watches": 2500, "men-watches": 3500,
    "accessories": 700, "sunglasses": 600, "jewellery": 800, "dresses": 1200,
  },
};

export function estimatePriceRon(brand: string, category: string): number {
  const tier = BRAND_TIERS[brand] ?? "accessible";
  const base = ESTIMATED_PRICES[tier][category] ?? 300;
  return base;
}

export function estimateCompareAtRon(priceRon: number): number {
  return Math.round(priceRon * COMPARE_MULTIPLIER / 10) * 10;
}
