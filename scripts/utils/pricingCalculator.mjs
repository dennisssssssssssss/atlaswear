const categoryMinimumsRon = {
  dresses: 199,
  clothing: 179,
  bags: 249,
  sneakers: 249,
  sandals: 199,
  mules: 229,
  boots: 299,
  swimwear: 149,
  accessories: 149,
  hats: 149,
  watches: 349,
  jewellery: 149,
  "polo-shirts": 179,
  hoodies: 249,
  caps: 149,
  sunglasses: 199,
  "men-sneakers": 299,
  "men-watches": 699,
  jackets: 299,
  pants: 199,
};

const brandMinimumsRon = {
  "Alexander McQueen": 249,
  "Audemars Piguet": 899,
  Balenciaga: 249,
  Bally: 229,
  Balmain: 229,
  Berluti: 249,
  "Bottega Veneta": 249,
  Bvlgari: 249,
  Burberry: 229,
  Cartier: 299,
  Celine: 249,
  Chanel: 299,
  "Christian Louboutin": 249,
  "Chrome Hearts": 249,
  Dior: 299,
  Fendi: 249,
  Ferragamo: 249,
  "Golden Goose": 229,
  Gucci: 249,
  Hermes: 349,
  "Jimmy Choo": 229,
  Loewe: 249,
  "Louis Vuitton": 299,
  "Miu Miu": 249,
  Moncler: 249,
  Prada: 249,
  Rolex: 899,
  "Saint Laurent": 249,
  "Tom Ford": 229,
  Valentino: 249,
  Versace: 229,
};

const compareMultipliers = {
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

const bestPriceCapsRon = {
  dresses: 349,
  clothing: 249,
  bags: 599,
  sneakers: 399,
  sandals: 299,
  mules: 329,
  boots: 449,
  swimwear: 199,
  accessories: 199,
  hats: 179,
  watches: 449,
  jewellery: 199,
  "polo-shirts": 249,
  hoodies: 399,
  caps: 179,
  sunglasses: 399,
  "men-sneakers": 699,
  "men-watches": 2499,
  jackets: 599,
  pants: 299,
};

const commercialPricePointsRon = [
  149, 179, 199, 219, 249, 279, 299, 329, 349, 379, 399, 449, 499, 549, 599,
  649, 699, 749, 799, 849, 899, 999, 1099, 1199, 1299, 1499, 1699, 1899,
  2199, 2499, 2999, 3499, 3999,
];

const isPositivePrice = (value) => Number.isFinite(value) && value > 0;

export const roundCommercialPriceRon = (value) => {
  const normalizedValue = Number(value);

  if (!isPositivePrice(normalizedValue)) {
    return commercialPricePointsRon[0];
  }

  return (
    commercialPricePointsRon.find((pricePoint) => pricePoint >= normalizedValue) ??
    Math.ceil(normalizedValue / 100) * 100 - 1
  );
};

export const getMinimumPublicPriceRon = (product) => {
  const categoryMinimum = categoryMinimumsRon[product.category] ?? 149;
  const brandMinimum = brandMinimumsRon[product.brand] ?? 0;

  return Math.max(categoryMinimum, brandMinimum);
};

export const calculateSalePriceRon = ({
  brand,
  category,
  estimatedPriceRon,
  sourceCostRon,
}) => {
  const minimumPublicPrice = getMinimumPublicPriceRon({ brand, category });
  let basePrice = isPositivePrice(Number(estimatedPriceRon))
    ? Number(estimatedPriceRon)
    : minimumPublicPrice;

  if (isPositivePrice(Number(sourceCostRon))) {
    const costRon = Number(sourceCostRon);
    const marginPrice = costRon / 0.55;
    const markupPrice = costRon + Math.max(90, costRon * 0.45);
    const premiumMultiplierPrice = costRon * 2.35;

    basePrice = Math.max(
      basePrice,
      marginPrice,
      markupPrice,
      premiumMultiplierPrice,
    );
  }

  return roundCommercialPriceRon(Math.max(basePrice, minimumPublicPrice));
};

export const calculateCompareAtRon = ({ priceRon, category }) => {
  const multiplier = compareMultipliers[category] ?? 1.7;

  return roundCommercialPriceRon(Number(priceRon) * multiplier);
};

export const isBestPrice = ({ priceRon, category }) => {
  const cap = bestPriceCapsRon[category] ?? 249;

  return Number(priceRon) <= cap;
};

export const applyPrivatePricingToProduct = (product) => {
  const priceRon = calculateSalePriceRon({
    brand: product.brand,
    category: product.category,
    estimatedPriceRon: product.priceRon,
    sourceCostRon: product.sourcePriceRon,
  });

  return {
    ...product,
    priceRon,
    compareAtRon: calculateCompareAtRon({
      priceRon,
      category: product.category,
    }),
    bestPrice: isBestPrice({ priceRon, category: product.category }),
  };
};

export const stripPrivatePricingFields = (product) => {
  const {
    costPrice,
    costPriceRon,
    costUsd,
    priceConfidence,
    sourceCostRon,
    sourcePriceRon,
    ...publicProduct
  } = product;

  return publicProduct;
};
