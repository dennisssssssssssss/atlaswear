import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const inputPath = path.join(__dirname, "qiqi-import.json");
const womenProductsPath = path.join(repoRoot, "src", "data", "women-products.ts");
const menProductsPath = path.join(repoRoot, "src", "data", "men-products.ts");

const COMPARE_MULTIPLIER = 2.4;
const today = new Date().toISOString().slice(0, 10);

const BRAND_TIERS = {
  Nike: "accessible",
  Adidas: "accessible",
  Jordan: "accessible",
  Lacoste: "accessible",
  "Ralph Lauren": "accessible",
  "New Balance": "accessible",
  Puma: "accessible",
  "Off-White": "mid-luxury",
  "Stone Island": "mid-luxury",
  Moncler: "mid-luxury",
  Versace: "mid-luxury",
  Balenciaga: "mid-luxury",
  Burberry: "mid-luxury",
  Coach: "mid-luxury",
  Celine: "mid-luxury",
  Fendi: "mid-luxury",
  Ferragamo: "mid-luxury",
  "Jimmy Choo": "mid-luxury",
  "Tory Burch": "mid-luxury",
  UGG: "accessible",
  Gucci: "luxury",
  Prada: "luxury",
  "Louis Vuitton": "luxury",
  "Saint Laurent": "luxury",
  Hermes: "luxury",
  "Bottega Veneta": "luxury",
  Loewe: "luxury",
  Valentino: "luxury",
  Zimmermann: "luxury",
  "Miu Miu": "luxury",
  Dior: "luxury",
  Chanel: "luxury",
  Rolex: "luxury",
  "Audemars Piguet": "luxury",
};

const ESTIMATED_PRICES = {
  accessible: {
    clothing: 220,
    "polo-shirts": 200,
    hoodies: 280,
    jackets: 350,
    pants: 230,
    "men-sneakers": 420,
    sneakers: 380,
    boots: 360,
    sandals: 300,
    caps: 160,
    sunglasses: 200,
    accessories: 180,
    "men-watches": 350,
  },
  "mid-luxury": {
    clothing: 550,
    "polo-shirts": 480,
    hoodies: 600,
    jackets: 750,
    pants: 500,
    "men-sneakers": 780,
    sneakers: 720,
    boots: 650,
    sandals: 580,
    caps: 320,
    sunglasses: 400,
    bags: 900,
    accessories: 380,
    "men-watches": 900,
  },
  luxury: {
    clothing: 900,
    "polo-shirts": 800,
    hoodies: 950,
    jackets: 1200,
    pants: 850,
    "men-sneakers": 1100,
    sneakers: 1100,
    sandals: 900,
    boots: 1100,
    mules: 1000,
    bags: 2200,
    watches: 2500,
    "men-watches": 3500,
    accessories: 700,
    sunglasses: 600,
    jewellery: 800,
    dresses: 1200,
    swimwear: 500,
  },
};

const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const sneakerSizes = ["39", "40", "41", "42", "43", "44", "45"];
const oneSize = ["One Size"];

function estimatePriceRon(brand, category) {
  const tier = BRAND_TIERS[brand] ?? "accessible";
  return ESTIMATED_PRICES[tier]?.[category] ?? 300;
}

function estimateCompareAtRon(priceRon) {
  return Math.round((priceRon * COMPARE_MULTIPLIER) / 10) * 10;
}

function normalizeName(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value) {
  return normalizeName(value).toLowerCase();
}

function detectBrand(sourceName, brandHint) {
  if (brandHint) {
    return brandHint;
  }

  const name = normalizeName(sourceName);

  if (/\b(nike|air force|dunk|air max)\b/i.test(name)) {
    return "Nike";
  }

  if (/\b(jordan|aj)\b/i.test(name)) {
    return "Jordan";
  }

  if (/\b(adidas|samba|campus|yeezy)\b/i.test(name)) {
    return "Adidas";
  }

  if (/\blacoste\b/i.test(name)) {
    return "Lacoste";
  }

  if (/\bralph lauren\b/i.test(name) || /\bpolo rl\b/i.test(name)) {
    return "Ralph Lauren";
  }

  if (/\boff[-\s]?white\b/i.test(name)) {
    return "Off-White";
  }

  if (/\bbalenciaga\b/i.test(name)) {
    return "Balenciaga";
  }

  if (/\bgucci\b/i.test(name)) {
    return "Gucci";
  }

  if (/\bburberry\b/i.test(name)) {
    return "Burberry";
  }

  if (/\b(chanel)\b/i.test(name)) {
    return "Chanel";
  }

  if (/\bdior\b/i.test(name)) {
    return "Dior";
  }

  if (/\bherm[eè]s\b|\bhermes\b/i.test(name)) {
    return "Hermes";
  }

  if (/\bloew[e]?\b/i.test(name)) {
    return "Loewe";
  }

  if (/\bmiu\s*miu\b|\bmiumiu\b/i.test(name)) {
    return "Miu Miu";
  }

  if (/\bceline\b/i.test(name)) {
    return "Celine";
  }

  if (/\bbottega\b/i.test(name)) {
    return "Bottega Veneta";
  }

  if (/\bfendi\b/i.test(name)) {
    return "Fendi";
  }

  if (/\bvalentino\b/i.test(name)) {
    return "Valentino";
  }

  if (/\bcoach\b/i.test(name)) {
    return "Coach";
  }

  if (/\bjimmy\s*choo\b/i.test(name)) {
    return "Jimmy Choo";
  }

  if (/\btory\s*burch\b/i.test(name)) {
    return "Tory Burch";
  }

  if (/\bugg\b/i.test(name)) {
    return "UGG";
  }

  if (/\bferragamo\b/i.test(name)) {
    return "Ferragamo";
  }

  if (/\byves\s*saint\s*laurent\b|\bsaint\s*laurent\b|\bysl\b/i.test(name)) {
    return "Saint Laurent";
  }

  if (/\blouis vuitton\b/i.test(name) || /(^|[^a-z])lv([^a-z]|$)/i.test(name)) {
    return "Louis Vuitton";
  }

  return "Unknown";
}

function isGenericName(sourceName) {
  const cleaned = normalizeName(sourceName);

  return /^(dress|polo|sneaker|boot|jacket|tee|t[-\s]?shirt|shirt|bikini|product|product info)$/i.test(
    cleaned,
  );
}

function hasCjkText(sourceName) {
  return /[\u3400-\u9fff]/u.test(sourceName);
}

function looksLikeKidsSizing(sourceName) {
  return /\bsz\s*\d{2,3}\s*-\s*\d{2,3}\b/i.test(sourceName);
}

function detectCategory(name, audienceHint) {
  const n = normalizeName(name).toLowerCase();
  const hasBagDimensions = /\b\d{1,3}\s*x\s*\d{1,3}\s*x\s*\d{1,3}\s*cm\b/i.test(n);
  const hasShoeSizeRange =
    /\b(?:sz|size)?\s*(?:3[4-9]|4[0-8])\s*[-/]\s*(?:3[4-9]|4[0-8])\b/i.test(n);

  if (hasBagDimensions) {
    return "bags";
  }

  if (audienceHint === "men" || audienceHint === "unisex") {
    if (hasShoeSizeRange) {
      return "men-sneakers";
    }

    if (
      n.includes("loafer") ||
      n.includes("oxford") ||
      n.includes("derby") ||
      n.includes("dress shoe") ||
      n.includes("moccasin") ||
      n.includes("monk")
    ) {
      return "men-sneakers";
    }

    if (
      n.includes("sneaker") ||
      n.includes("trainer") ||
      n.includes("air force") ||
      n.includes("jordan") ||
      n.includes("dunk") ||
      n.includes("yeezy") ||
      n.includes("samba") ||
      n.includes("campus")
    ) {
      return "men-sneakers";
    }

    if (n.includes("boot") || n.includes("chelsea")) {
      return "boots";
    }

    if (n.includes("sandal") || n.includes("slide") || n.includes("flip")) {
      return "sandals";
    }

    if (n.includes("polo") || n.includes("lacoste") || n.includes("ralph")) {
      return "polo-shirts";
    }

    if (n.includes("hoodie") || n.includes("sweatshirt")) {
      return "hoodies";
    }

    if (n.includes("jacket") || n.includes("coat") || n.includes("blazer")) {
      return "jackets";
    }

    if (n.includes("cap") || n.includes("hat") || n.includes("beanie")) {
      return "caps";
    }

    if (n.includes("sunglass") || n.includes("eyewear")) {
      return "sunglasses";
    }

    if (n.includes("watch") || n.includes("timepiece")) {
      return "men-watches";
    }

    if (n.includes("bag") || n.includes("backpack") || n.includes("tote")) {
      return "bags";
    }
  }

  if (audienceHint === "women") {
    if (hasShoeSizeRange) {
      return n.includes("ugg") ? "boots" : "sneakers";
    }

    if (n.includes("sneaker") || n.includes("trainer")) {
      return "sneakers";
    }

    if (
      n.includes("sandal") ||
      n.includes("slide") ||
      n.includes("flip") ||
      n.includes("heel") ||
      n.includes("pump") ||
      n.includes("stiletto")
    ) {
      return "sandals";
    }

    if (n.includes("loafer") || n.includes("mule") || n.includes("flat")) {
      return "mules";
    }

    if (n.includes("boot") || n.includes("chelsea")) {
      return "boots";
    }

    if (
      n.includes("bag") ||
      n.includes("tote") ||
      n.includes("purse") ||
      n.includes("handbag") ||
      n.includes("clutch") ||
      n.includes("satchel") ||
      n.includes("hobo") ||
      n.includes("crossbody")
    ) {
      return "bags";
    }

    if (n.includes("dress") || n.includes("gown") || n.includes("skirt")) {
      return "dresses";
    }

    if (n.includes("bikini") || n.includes("swimsuit") || n.includes("swimwear")) {
      return "swimwear";
    }
  }

  if (
    n.includes("bag") ||
    n.includes("tote") ||
    n.includes("purse") ||
    n.includes("handbag")
  ) {
    return "bags";
  }

  if (n.includes("dress") || n.includes("gown")) {
    return "dresses";
  }

  if (n.includes("jacket") || n.includes("coat")) {
    return "jackets";
  }

  if (n.includes("hoodie") || n.includes("sweatshirt")) {
    return "hoodies";
  }

  return "clothing";
}

function getImageUrls(entry) {
  return Array.from(
    new Set(
      (Array.isArray(entry.imageUrls) && entry.imageUrls.length > 0
        ? entry.imageUrls
        : [entry.imageUrl]
      )
        .map(normalizeName)
        .filter(Boolean),
    ),
  );
}

function prepareEntries(entries) {
  const stats = {
    input: entries.length,
    skippedInvalid: 0,
    skippedUnknownBrand: 0,
    skippedGenericName: 0,
    skippedCjkName: 0,
    skippedKidsSizing: 0,
    mergedDuplicates: 0,
  };
  const grouped = new Map();

  for (const entry of entries) {
    const sourceId = normalizeName(entry.sourceId);
    const sourceName = normalizeName(entry.sourceName);
    const audience = normalizeName(entry.audienceHint || "unisex");
    const category = detectCategory(sourceName, audience);
    const brand = detectBrand(sourceName, entry.brandHint);
    const imageUrls = getImageUrls(entry);

    if (!sourceId || !sourceName || imageUrls.length === 0) {
      stats.skippedInvalid += 1;
      continue;
    }

    if (isGenericName(sourceName)) {
      stats.skippedGenericName += 1;
      continue;
    }

    if (hasCjkText(sourceName)) {
      stats.skippedCjkName += 1;
      continue;
    }

    if (looksLikeKidsSizing(sourceName)) {
      stats.skippedKidsSizing += 1;
      continue;
    }

    if (brand === "Unknown") {
      stats.skippedUnknownBrand += 1;
      continue;
    }

    const key = [
      normalizeKey(brand),
      normalizeKey(sourceName),
      normalizeKey(category),
      normalizeKey(audience),
    ].join("::");
    const existing = grouped.get(key);

    if (existing) {
      existing.imageUrls = Array.from(new Set([...existing.imageUrls, ...imageUrls]));
      stats.mergedDuplicates += 1;
      continue;
    }

    grouped.set(key, {
      ...entry,
      sourceId,
      sourceName,
      brandHint: brand,
      categoryHint: category,
      audienceHint: audience,
      imageUrl: imageUrls[0],
      imageUrls,
    });
  }

  return {
    entries: [...grouped.values()],
    stats,
  };
}

function sizesForCategory(category) {
  if (category === "men-sneakers" || category === "sneakers") {
    return sneakerSizes;
  }

  if (
    [
      "accessories",
      "caps",
      "hats",
      "watches",
      "men-watches",
      "sunglasses",
      "jewellery",
    ].includes(category)
  ) {
    return oneSize;
  }

  return clothingSizes;
}

function tsString(value) {
  return JSON.stringify(value);
}

function tsArray(values) {
  return `[${values.map((value) => tsString(value)).join(", ")}]`;
}

function productBlock(entry) {
  const sourceId = normalizeName(entry.sourceId);
  const sourceName = normalizeName(entry.sourceName);
  const imageUrls = getImageUrls(entry);
  const category = normalizeName(entry.categoryHint || "clothing");
  const audience = normalizeName(entry.audienceHint || "unisex");
  const brand = detectBrand(sourceName, entry.brandHint);
  const priceRon = estimatePriceRon(brand, category);
  const compareAtRon = estimateCompareAtRon(priceRon);
  const sizes = sizesForCategory(category);

  return `  product({
    id: ${tsString(`qiqi-${sourceId}`)},
    name: ${tsString(sourceName)},
    brand: ${tsString(brand)},
    category: ${tsString(category)},
    audience: ${tsString(audience)},
    description: localize(${tsString(`${sourceName} - premium quality.`)}, 
      ${tsString(`${sourceName} - calitate premium.`)}),
    details: [],
    priceRon: ${priceRon},
    compareAtRon: ${compareAtRon},
    images: ${tsArray(imageUrls)},
    imageFit: "cover",
    sizes: ${tsArray(sizes)},
    colors: [],
    featured: false,
    isNewArrival: true,
    bestPrice: false,
    addedAt: ${tsString(today)},
    authentic: true,
    sealed: true,
  })`;
}

function validateEntry(entry) {
  const sourceId = normalizeName(entry.sourceId);
  const sourceName = normalizeName(entry.sourceName);
  const imageUrls = Array.isArray(entry.imageUrls) ? entry.imageUrls : [entry.imageUrl];

  if (!sourceId || !sourceName || imageUrls.map(normalizeName).filter(Boolean).length === 0) {
    return false;
  }

  return true;
}

async function appendProducts(filePath, entries) {
  if (!entries.length) {
    return 0;
  }

  const original = await readFile(filePath, "utf8");
  const blocks = [];

  for (const entry of entries) {
    const id = `qiqi-${normalizeName(entry.sourceId)}`;

    if (original.includes(`id: ${tsString(id)}`)) {
      console.log(`Skipping duplicate ${id} in ${path.relative(repoRoot, filePath)}`);
      continue;
    }

    blocks.push(productBlock(entry));
  }

  if (!blocks.length) {
    return 0;
  }

  const insertionPoint = original.lastIndexOf("\n];");

  if (insertionPoint === -1) {
    throw new Error(`Could not find array ending in ${filePath}`);
  }

  const before = original.slice(0, insertionPoint).trimEnd();
  const after = original.slice(insertionPoint);
  const needsComma = !before.endsWith("[") && !before.endsWith(",");
  const insertion = `${needsComma ? "," : ""}\n${blocks.join(",\n")}`;
  const next = `${before}${insertion}${after}`;

  await writeFile(filePath, next, "utf8");
  return blocks.length;
}

async function main() {
  const raw = await readFile(inputPath, "utf8");
  const rawEntries = JSON.parse(raw).filter(validateEntry);
  const { entries, stats } = prepareEntries(rawEntries);
  const womenEntries = entries.filter((entry) => entry.audienceHint === "women");
  const menEntries = entries.filter((entry) => entry.audienceHint !== "women");

  const womenCount = await appendProducts(womenProductsPath, womenEntries);
  const menCount = await appendProducts(menProductsPath, menEntries);

  console.log(`Imported ${womenCount} women products`);
  console.log(`Imported ${menCount} men/unisex products`);
  console.log(`Skipped invalid products: ${stats.skippedInvalid}`);
  console.log(`Skipped generic-name products: ${stats.skippedGenericName}`);
  console.log(`Skipped non-Latin-name products: ${stats.skippedCjkName}`);
  console.log(`Skipped kids-sizing products: ${stats.skippedKidsSizing}`);
  console.log(`Skipped unknown-brand products: ${stats.skippedUnknownBrand}`);
  console.log(`Merged duplicate product entries: ${stats.mergedDuplicates}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
