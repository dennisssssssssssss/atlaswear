import {
  mkdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoDir = path.resolve(__dirname, "..");
const workspaceDir = path.resolve(repoDir, "..");
const publicDir = path.join(repoDir, "public");
const catalogOutputPath = path.join(repoDir, "src", "data", "women-catalog.ts");
const sourceProductsOutputPath = path.join(
  publicDir,
  "source-data",
  "source-products.json",
);
const sourceDataDir = path.join(publicDir, "source-data");
const collectionsImageDir = path.join(publicDir, "source-collections");
const sourceProductsImageDir = path.join(publicDir, "source-products");

const SOURCE_LABELS = {
  qiqiyg: { en: "QiQiYG", ro: "QiQiYG" },
  weifeng: { en: "Weifeng", ro: "Weifeng" },
  deshengxing: { en: "Deshengxing", ro: "Deshengxing" },
  "198maoyi": { en: "198 Maoyi", ro: "198 Maoyi" },
};

const SECTION_DEFS = [
  {
    id: "dresses",
    label: { en: "Dresses", ro: "Rochii" },
    description: {
      en: "Fashion dresses and occasion lines gathered from the women supplier network.",
      ro: "Rochii fashion si linii pentru ocazii, adunate din reteaua de furnizori pentru femei.",
    },
  },
  {
    id: "clothing",
    label: { en: "Clothing", ro: "Imbracaminte" },
    description: {
      en: "Premium women clothing edits, matching sets, and easy daywear pieces.",
      ro: "Selectii premium de imbracaminte de dama, seturi si piese usor de purtat zi de zi.",
    },
  },
  {
    id: "bags",
    label: { en: "Bags", ro: "Genti" },
    description: {
      en: "Handbags, shoulder bags, hobos, top-handle silhouettes, and travel-ready styles.",
      ro: "Posete, genti de umar, hobo, siluete top-handle si modele pregatite si pentru travel.",
    },
  },
  {
    id: "shoes",
    label: { en: "Shoes", ro: "Pantofi" },
    description: {
      en: "Women shoes, sneakers, sandals, slides, and low-profile styles across the suppliers.",
      ro: "Pantofi de dama, sneakers, sandale, slides si modele low-profile din toate sursele.",
    },
  },
  {
    id: "accessories",
    label: { en: "Accessories", ro: "Accesorii" },
    description: {
      en: "Jewelry, belts, scarves, eyewear, and smaller add-ons for women.",
      ro: "Bijuterii, curele, esarfe, eyewear si alte accesorii mici pentru femei.",
    },
  },
  {
    id: "swimwear",
    label: { en: "Swimwear", ro: "Swimwear" },
    description: {
      en: "Beach-ready categories that sit outside the main dress and accessory edit.",
      ro: "Categorii pentru plaja care stau separat de editia principala de rochii si accesorii.",
    },
  },
];

const WEIFENG_CONFIG = [
  { id: "4769316", titleEn: "Women's Sandals", titleRo: "Sandale de dama" },
  {
    id: "4769313",
    titleEn: "Chanel Women's Shoes",
    titleRo: "Pantofi Chanel de dama",
  },
  {
    id: "4769311",
    titleEn: "Louis Vuitton Women's Shoes",
    titleRo: "Pantofi Louis Vuitton de dama",
  },
  {
    id: "4769309",
    titleEn: "Gucci Women's Shoes",
    titleRo: "Pantofi Gucci de dama",
  },
  {
    id: "4769306",
    titleEn: "Christian Dior Women's Shoes",
    titleRo: "Pantofi Christian Dior de dama",
  },
  {
    id: "4769304",
    titleEn: "Dior Women's Shoes",
    titleRo: "Pantofi Dior de dama",
  },
  {
    id: "4769301",
    titleEn: "Versace Women's Shoes",
    titleRo: "Pantofi Versace de dama",
  },
  {
    id: "4770256",
    titleEn: "Balenciaga Women's Shoes",
    titleRo: "Pantofi Balenciaga de dama",
  },
  {
    id: "4769299",
    titleEn: "Alexander McQueen Women's Shoes",
    titleRo: "Pantofi Alexander McQueen de dama",
  },
  {
    id: "4769297",
    titleEn: "Philipp Plein Women's Shoes",
    titleRo: "Pantofi Philipp Plein de dama",
  },
  {
    id: "4769295",
    titleEn: "Ferragamo Women's Shoes",
    titleRo: "Pantofi Ferragamo de dama",
  },
  {
    id: "4769293",
    titleEn: "Fendi Women's Shoes",
    titleRo: "Pantofi Fendi de dama",
  },
  {
    id: "4769290",
    titleEn: "Dolce & Gabbana Women's Shoes",
    titleRo: "Pantofi Dolce & Gabbana de dama",
  },
  {
    id: "4769287",
    titleEn: "Hermes Women's Shoes",
    titleRo: "Pantofi Hermes de dama",
  },
  {
    id: "4769285",
    titleEn: "Prada Women's Shoes",
    titleRo: "Pantofi Prada de dama",
  },
  {
    id: "4769283",
    titleEn: "Givenchy Women's Shoes",
    titleRo: "Pantofi Givenchy de dama",
  },
  {
    id: "4769281",
    titleEn: "Burberry Women's Shoes",
    titleRo: "Pantofi Burberry de dama",
  },
  {
    id: "4769279",
    titleEn: "Louboutin Women's Shoes",
    titleRo: "Pantofi Louboutin de dama",
  },
  {
    id: "4769330",
    titleEn: "Miu Miu Women's Shoes",
    titleRo: "Pantofi Miu Miu de dama",
  },
  {
    id: "4769318",
    titleEn: "Bottega Veneta Women's Shoes",
    titleRo: "Pantofi Bottega Veneta de dama",
  },
  {
    id: "4769277",
    titleEn: "Jimmy Choo Women's Shoes",
    titleRo: "Pantofi Jimmy Choo de dama",
  },
  {
    id: "4769276",
    titleEn: "Roger Vivier Women's Shoes",
    titleRo: "Pantofi Roger Vivier de dama",
  },
  {
    id: "4769274",
    titleEn: "Tory Burch Women's Shoes",
    titleRo: "Pantofi Tory Burch de dama",
  },
  {
    id: "4769272",
    titleEn: "Saint Laurent Women's Shoes",
    titleRo: "Pantofi Saint Laurent de dama",
  },
  {
    id: "4769319",
    titleEn: "Celine Women's Shoes",
    titleRo: "Pantofi Celine de dama",
  },
];

const DESHENGXING_CONFIG = [
  { id: "5048815", titleEn: "UGG Boots & Cold Weather", titleRo: "UGG pentru sezon rece" },
  { id: "4161011", titleEn: "UGG Slides & Sandals", titleRo: "UGG slides si sandale" },
  { id: "4161021", titleEn: "Birkenstock Boston", titleRo: "Birkenstock Boston" },
  { id: "113101", titleEn: "Nike Slides & Sandals", titleRo: "Nike slides si sandale" },
  { id: "4541246", titleEn: "Adidas Slides", titleRo: "Adidas slides" },
  { id: "5168454", titleEn: "Bottega Veneta Shoes", titleRo: "Pantofi Bottega Veneta" },
  { id: "5182069", titleEn: "HOKA Running", titleRo: "HOKA running" },
  { id: "5182084", titleEn: "Rick Owens Series", titleRo: "Seria Rick Owens" },
  { id: "5168432", titleEn: "Maison Margiela Trainers", titleRo: "Maison Margiela trainers" },
  { id: "5168423", titleEn: "Fendi Match Sneakers", titleRo: "Fendi Match sneakers" },
  { id: "2878193", titleEn: "Amiri Skeleton Shoes", titleRo: "Pantofi Amiri Skeleton" },
  { id: "5168419", titleEn: "Lanvin Series", titleRo: "Seria Lanvin" },
  { id: "5159087", titleEn: "Loewe Ballet Runner", titleRo: "Loewe Ballet Runner" },
  { id: "5159008", titleEn: "Valentino Trainers", titleRo: "Valentino trainers" },
  { id: "564210", titleEn: "Golden Goose", titleRo: "Golden Goose" },
  { id: "2950696", titleEn: "LV & Hermes Slides", titleRo: "LV si Hermes slides" },
  { id: "113109", titleEn: "Gucci & Versace Slides", titleRo: "Gucci si Versace slides" },
];

const MAOYI_CONFIG = [
  { id: "5101137", titleEn: "Mary Jane Platforms", titleRo: "Mary Jane cu platforma" },
  { id: "4600563", titleEn: "Miu Miu 530 Sneakers", titleRo: "Sneakers Miu Miu 530" },
  { id: "3581601", titleEn: "327 Sneakers", titleRo: "Sneakers 327" },
  { id: "3532846", titleEn: "530 Sneakers", titleRo: "Sneakers 530" },
  { id: "4616260", titleEn: "574 Platform", titleRo: "574 cu platforma" },
  { id: "4622075", titleEn: "Chunky Dad Sneakers", titleRo: "Dad sneakers chunky" },
];

const QIQIYG_COLLECTION_SOURCES = [
  {
    cacheName: "qiqiyg-dresses-page1.html",
    url: "https://qiqiyg.com/categoryen_170.html?path=0_170",
    source: "qiqiyg",
    section: "dresses",
    filter: () => true,
    transform: (item) => {
      const lower = item.name.en.toLowerCase();
      if (lower.includes("bikini")) {
        item.section = "swimwear";
      } else if (lower.includes("lululemon") || lower.includes("alo")) {
        item.section = "clothing";
      }
      if (
        /zimmermann|prada|celine|max mara|loewe|dior|burberry|valentino/i.test(
          item.name.en,
        )
      ) {
        item.tags = [...item.tags, "modest"];
        item.featured = true;
      }
      return item;
    },
  },
  {
    cacheName: "qiqiyg-bags-home.html",
    url: "https://bags.qiqiyg.com/",
    source: "qiqiyg",
    section: "bags",
    filter: (item) => !item.title.toLowerCase().includes("luggage"),
    transform: (item) => {
      item.featured = /chanel|dior|hermes|loewe|miumiu|prada|ysl/i.test(
        item.name.en,
      );
      return item;
    },
  },
  {
    cacheName: "qiqiyg-acc-home.html",
    url: "https://acc.qiqiyg.com/",
    source: "qiqiyg",
    section: "accessories",
    filter: (item) =>
      /jewelry|glasses|belts|watches|scarf|hair band|sunglasses|perfume/i.test(
        item.title,
      ),
    transform: (item) => {
      item.featured = /jewelry|scarf|sunglasses/i.test(item.name.en);
      return item;
    },
  },
];

const SOURCE_PRODUCT_PAGES = [
  {
    kind: "qiqiyg",
    cacheName: "qiqiyg-dress-zimmermann.html",
    url: "https://qiqiyg.com/categoryen_360025.html?path=0_170_360025",
    source: "qiqiyg",
    sourceCollection: { en: "Zimmermann Dresses", ro: "Rochii Zimmermann" },
    defaultBrand: "Zimmermann",
    defaultCategory: "dresses",
    tags: ["modest"],
  },
  {
    kind: "qiqiyg",
    cacheName: "qiqiyg-dress-prada.html",
    url: "https://qiqiyg.com/categoryen_240369.html?path=0_170_240369",
    source: "qiqiyg",
    sourceCollection: { en: "Prada Dresses", ro: "Rochii Prada" },
    defaultBrand: "Prada",
    defaultCategory: "dresses",
    tags: ["modest"],
  },
  {
    kind: "qiqiyg",
    cacheName: "qiqiyg-dress-miumiu.html",
    url: "https://qiqiyg.com/categoryen_240368.html?path=0_170_240368",
    source: "qiqiyg",
    sourceCollection: { en: "Miu Miu Dresses", ro: "Rochii Miu Miu" },
    defaultBrand: "Miu Miu",
    defaultCategory: "clothing",
    tags: [],
  },
  {
    kind: "qiqiyg",
    cacheName: "qiqiyg-bags-loewe.html",
    url: "https://bags.qiqiyg.com/categoryen_23239.html?path=0_23239",
    source: "qiqiyg",
    sourceCollection: { en: "Loewe Bags", ro: "Genti Loewe" },
    defaultBrand: "Loewe",
    defaultCategory: "bags",
    tags: [],
  },
  {
    kind: "qiqiyg",
    cacheName: "qiqiyg-bags-prada.html",
    url: "https://bags.qiqiyg.com/categoryen_2412.html?path=0_2412",
    source: "qiqiyg",
    sourceCollection: { en: "Prada Bags", ro: "Genti Prada" },
    defaultBrand: "Prada",
    defaultCategory: "bags",
    tags: [],
  },
  {
    kind: "qiqiyg",
    cacheName: "qiqiyg-bags-miumiu.html",
    url: "https://bags.qiqiyg.com/categoryen_183973.html?path=0_183973",
    source: "qiqiyg",
    sourceCollection: { en: "Miu Miu Bags", ro: "Genti Miu Miu" },
    defaultBrand: "Miu Miu",
    defaultCategory: "bags",
    tags: [],
  },
  {
    kind: "qiqiyg",
    cacheName: "qiqiyg-bags-ysl.html",
    url: "https://bags.qiqiyg.com/categoryen_113135.html?path=0_113135",
    source: "qiqiyg",
    sourceCollection: { en: "Saint Laurent Bags", ro: "Genti Saint Laurent" },
    defaultBrand: "Saint Laurent",
    defaultCategory: "bags",
    tags: [],
  },
  {
    kind: "yupoo",
    cacheName: "weifeng-women-sandals-page1.html",
    url: "https://weifengfz.x.yupoo.com/categories/4769316?page=1",
    source: "weifeng",
    sourceCollection: { en: "Women's Sandals", ro: "Sandale de dama" },
    defaultBrand: "",
    defaultCategory: "sandals",
    tags: [],
  },
  {
    kind: "yupoo",
    cacheName: "weifeng-lv-women-page1.html",
    url: "https://weifengfz.x.yupoo.com/categories/4769311?page=1",
    source: "weifeng",
    sourceCollection: {
      en: "Louis Vuitton Women's Shoes",
      ro: "Pantofi Louis Vuitton de dama",
    },
    defaultBrand: "Louis Vuitton",
    defaultCategory: "sneakers",
    tags: [],
  },
  {
    kind: "yupoo",
    cacheName: "weifeng-gucci-women-page1.html",
    url: "https://weifengfz.x.yupoo.com/categories/4769309?page=1",
    source: "weifeng",
    sourceCollection: { en: "Gucci Women's Shoes", ro: "Pantofi Gucci de dama" },
    defaultBrand: "Gucci",
    defaultCategory: "sandals",
    tags: [],
  },
  {
    kind: "yupoo",
    cacheName: "deshengxing-slides-page1.html",
    url: "https://deshengxing.x.yupoo.com/categories/113101?page=1",
    source: "deshengxing",
    sourceCollection: { en: "Slides & Sandals", ro: "Slides si sandale" },
    defaultBrand: "",
    defaultCategory: "sandals",
    tags: [],
  },
  {
    kind: "yupoo",
    cacheName: "198maoyi-miumiu-page1.html",
    url: "https://198maoyi.x.yupoo.com/categories/4600563?page=1",
    source: "198maoyi",
    sourceCollection: { en: "Miu Miu 530 Sneakers", ro: "Sneakers Miu Miu 530" },
    defaultBrand: "Miu Miu",
    defaultCategory: "sneakers",
    tags: [],
  },
];

function yupooDefaultCategory(titleEn) {
  if (/boot|cold weather|ugg/i.test(titleEn)) {
    return "boots";
  }
  if (/slide|sandal/i.test(titleEn)) {
    return "sandals";
  }
  if (/mary jane|loafer|boston|flat/i.test(titleEn)) {
    return "mules";
  }

  return "sneakers";
}

function yupooAudience(titleEn) {
  if (/women/i.test(titleEn)) {
    return "women";
  }
  if (/men/i.test(titleEn)) {
    return "men";
  }

  return "unisex";
}

function yupooProductPages(configs, source, baseUrl) {
  return configs.map((config) => ({
    kind: "yupoo",
    cacheName: `${source}-${config.id}.html`,
    url: `${baseUrl}/categories/${config.id}?page=1`,
    source,
    sourceCollection: { en: config.titleEn, ro: config.titleRo },
    defaultBrand: detectBrand(config.titleEn, ""),
    defaultCategory: yupooDefaultCategory(config.titleEn),
    audience: yupooAudience(config.titleEn),
    tags: [],
  }));
}

const EXTRA_SOURCE_PRODUCT_PAGES = [
  {
    kind: "qiqiyg",
    cacheName: "qiqiyg-tshirts.html",
    url: "https://qiqiyg.com/categoryen_11.html?path=0_11",
    source: "qiqiyg",
    sourceCollection: { en: "Men T-Shirts & Tops", ro: "Tricouri si topuri barbati" },
    defaultBrand: "",
    defaultCategory: "clothing",
    audience: "men",
    tags: ["men"],
  },
  {
    kind: "qiqiyg",
    cacheName: "qiqiyg-jackets.html",
    url: "https://qiqiyg.com/categoryen_394.html?path=0_394",
    source: "qiqiyg",
    sourceCollection: {
      en: "Men Jackets & Outerwear",
      ro: "Jachete si outerwear barbati",
    },
    defaultBrand: "",
    defaultCategory: "clothing",
    audience: "men",
    tags: ["men"],
  },
  {
    kind: "yupoo",
    cacheName: "weifeng-lv-men-page1.html",
    url: "https://weifengfz.x.yupoo.com/categories/4769312?page=1",
    source: "weifeng",
    sourceCollection: {
      en: "Louis Vuitton Men's Shoes",
      ro: "Pantofi Louis Vuitton barbati",
    },
    defaultBrand: "Louis Vuitton",
    defaultCategory: "sneakers",
    audience: "men",
    tags: ["men"],
  },
  ...yupooProductPages(
    WEIFENG_CONFIG,
    "weifeng",
    "https://weifengfz.x.yupoo.com",
  ),
  ...yupooProductPages(
    DESHENGXING_CONFIG,
    "deshengxing",
    "https://deshengxing.x.yupoo.com",
  ),
  ...yupooProductPages(MAOYI_CONFIG, "198maoyi", "https://198maoyi.x.yupoo.com"),
];

const CATEGORY_LABELS = {
  dresses: { en: "Dresses", ro: "Rochii" },
  clothing: { en: "Clothing", ro: "Imbracaminte" },
  bags: { en: "Bags", ro: "Genti" },
  sneakers: { en: "Sneakers", ro: "Sneakers" },
  sandals: { en: "Sandals", ro: "Sandale" },
  mules: { en: "Mules & Loafers", ro: "Mules si loafers" },
  boots: { en: "Boots", ro: "Ghete si cizme" },
  swimwear: { en: "Swimwear", ro: "Swimwear" },
  accessories: { en: "Accessories", ro: "Accesorii" },
  hats: { en: "Hats", ro: "Sepci" },
  watches: { en: "Watches", ro: "Ceasuri" },
  jewellery: { en: "Jewellery", ro: "Bijuterii" },
};

const CATEGORY_NOUNS = {
  dresses: "Dress",
  clothing: "Piece",
  bags: "Bag",
  sneakers: "Sneaker",
  sandals: "Sandal",
  mules: "Mule",
  boots: "Boot",
  swimwear: "Swimwear",
  accessories: "Accessory",
  hats: "Hat",
  watches: "Watch",
  jewellery: "Jewellery",
};

function hasFile(filePath) {
  return stat(filePath)
    .then(() => true)
    .catch(() => false);
}

function repairMojibake(value) {
  if (!value) {
    return "";
  }

  try {
    const repaired = Buffer.from(value, "latin1").toString("utf8");
    const badOriginal = (value.match(/[ÃÂðåæç]/g) ?? []).length;
    const badRepaired = (repaired.match(/[ÃÂðåæç]/g) ?? []).length;
    return badRepaired < badOriginal ? repaired : value;
  } catch {
    return value;
  }
}

function decodeHtml(value) {
  return repairMojibake(String(value ?? ""))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeTs(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, " ")
    .trim();
}

function absoluteUrl(baseUrl, input) {
  return new URL(input, baseUrl).toString();
}

function safeId(value) {
  return decodeHtml(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0).toString(36);
}

function localize(en, ro = en) {
  return {
    en: decodeHtml(en),
    ro: decodeHtml(ro),
  };
}

function qiqiygRoTitle(title) {
  return title
    .replace(/^New Arrival/i, "Noutati")
    .replace(/^Jewelry/i, "Bijuterii")
    .replace(/^Belts/i, "Curele")
    .replace(/^Watches/i, "Ceasuri")
    .replace(/^Scarf/i, "Esarfe")
    .replace(/^Glasses Factory/i, "Ochelari Factory")
    .replace(/^Plain Glasses/i, "Ochelari")
    .replace(/^Glasses/i, "Ochelari")
    .replace(/^Hair Band Clasp Tie/i, "Bentite si accesorii de par")
    .replace(/^Bikini/i, "Bikini");
}

async function readCachedOrFetch(cacheName, url) {
  const cachePath = path.join(workspaceDir, cacheName);

  try {
    return await readFile(cachePath, "utf8");
  } catch {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const text = await response.text();
    await writeFile(cachePath, text, "utf8");
    return text;
  }
}

function parseQiqiygCollections(
  html,
  baseUrl,
  source,
  defaultSection,
  filter,
  transform,
) {
  const regex =
    /<div class="category_160">[\s\S]*?<a title="([^"]+)" href="([^"]+)">[\s\S]*?data-original="([^"]+)"[\s\S]*?<a href="[^"]+" title="[^"]+" class="brown_a">([^<]+)<\/a>\s*\((\d+)\)/gi;

  const items = [];
  let match;

  while ((match = regex.exec(html))) {
    const title = decodeHtml(match[4] || match[1]);
    const raw = {
      title,
      href: absoluteUrl(baseUrl, match[2]),
      image: absoluteUrl(baseUrl, match[3]),
      count: Number.parseInt(match[5], 10) || null,
    };

    if (filter && !filter(raw)) {
      continue;
    }

    const item = {
      id: `${source}-${safeId(title)}`,
      title,
      name: localize(title, qiqiygRoTitle(title)),
      source,
      section: defaultSection,
      href: raw.href,
      image: raw.image,
      count: raw.count,
      featured: false,
      tags: [],
    };

    items.push(transform ? transform(item) : item);
  }

  return items;
}

function parseYupooCategoryMeta(html) {
  const countMatch = html.match(/共(\d+)个相册/) ?? html.match(/å…±(\d+)ä¸ªç›¸å†Œ/);
  const imageMatch = html.match(/data-src="([^"]+)"/);

  return {
    count: countMatch ? Number.parseInt(countMatch[1], 10) : null,
    image: imageMatch ? imageMatch[1] : null,
  };
}

async function buildYupooCollection(config, baseUrl, source) {
  const href = `${baseUrl}/categories/${config.id}?page=1`;
  const html = await readCachedOrFetch(`${source}-${config.id}.html`, href);
  const meta = parseYupooCategoryMeta(html);

  return {
    id: `${source}-${config.id}`,
    name: localize(config.titleEn, config.titleRo),
    source,
    section: "shoes",
    href,
    image: meta.image ?? "",
    count: meta.count,
    featured: /Miu Miu|Mary Jane|Sandals|LV|Chanel|Loewe|Valentino/i.test(
      config.titleEn,
    ),
    tags: [],
  };
}

function extractSizeLabel(title) {
  const numericRange = title.match(/\b(\d{2})\s*-\s*(\d{2})\b/);
  if (numericRange) {
    return `${numericRange[1]}-${numericRange[2]}`;
  }

  const letterRange = title.match(/\b(XXS|XS|S|M|L|XL|XXL)\s*-\s*(XXS|XS|S|M|L|XL|XXL)\b/i);
  if (letterRange) {
    return `${letterRange[1].toUpperCase()}-${letterRange[2].toUpperCase()}`;
  }

  if (/one size/i.test(title)) {
    return "One Size";
  }

  return "";
}

function expandSizeLabel(sizeLabel) {
  if (!sizeLabel) {
    return [];
  }

  if (sizeLabel === "One Size") {
    return ["One Size"];
  }

  const numericRange = sizeLabel.match(/^(\d{2})-(\d{2})$/);
  if (numericRange) {
    const start = Number.parseInt(numericRange[1], 10);
    const end = Number.parseInt(numericRange[2], 10);
    if (end >= start && end - start <= 15) {
      return Array.from({ length: end - start + 1 }, (_, index) =>
        String(start + index),
      );
    }
  }

  const order = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
  const letterRange = sizeLabel.match(/^(XXS|XS|S|M|L|XL|XXL)-(XXS|XS|S|M|L|XL|XXL)$/);
  if (letterRange) {
    const startIndex = order.indexOf(letterRange[1]);
    const endIndex = order.indexOf(letterRange[2]);
    if (startIndex >= 0 && endIndex >= startIndex) {
      return order.slice(startIndex, endIndex + 1);
    }
  }

  return [sizeLabel];
}

function detectBrand(title, fallbackBrand = "") {
  const normalized = decodeHtml(title).toLowerCase();
  const checks = [
    [/saint laurent|ysl/, "Saint Laurent"],
    [/louis vuitton|\blv\b/, "Louis Vuitton"],
    [/miu miu|\b530miu\b|\b530 miu\b|\b530miu\b/, "Miu Miu"],
    [/loewe/, "Loewe"],
    [/zimmermann/, "Zimmermann"],
    [/prada/, "Prada"],
    [/gucci/, "Gucci"],
    [/herm[eè]s|爱马仕/, "Hermes"],
    [/chanel/, "Chanel"],
    [/dior/, "Dior"],
    [/fendi/, "Fendi"],
    [/ugg/, "UGG"],
    [/birkenstock/, "Birkenstock"],
    [/balenciaga/, "Balenciaga"],
    [/hoka/, "HOKA"],
    [/new balance|\bnb\b|\b327\b|\b530\b|\b574\b|\bms327\b|\bu327\b|\buwrpd/i, "New Balance"],
    [/adidas/, "Adidas"],
    [/nike/, "Nike"],
    [/puma/, "Puma"],
    [/valentino/, "Valentino"],
    [/golden goose/, "Golden Goose"],
    [/maison margiela/, "Maison Margiela"],
    [/bottega veneta/, "Bottega Veneta"],
    [/roger vivier/, "Roger Vivier"],
    [/jimmy choo/, "Jimmy Choo"],
    [/celine/, "Celine"],
    [/burberry/, "Burberry"],
  ];

  for (const [pattern, brand] of checks) {
    if (pattern.test(normalized)) {
      return brand;
    }
  }

  return fallbackBrand || "Designer";
}

function detectCategory(title, fallbackCategory) {
  const normalized = decodeHtml(title).toLowerCase();

  if (/bikini|swim/.test(normalized)) {
    return "swimwear";
  }
  if (/dress|gown|midi|mini/.test(normalized)) {
    return "dresses";
  }
  if (/\bt[-\s]?shirt\b|\btee\b|\bshirt\b|\bjacket\b|\bcoat\b|\bhoodie\b|\bpants\b|\bshorts\b/.test(normalized)) {
    return "clothing";
  }
  if (
    /bag|hobo|tote|shoulder|satchel|puzzle|flamenco|handle|clutch|pochette|bucket|crossbody/.test(
      normalized,
    )
  ) {
    return "bags";
  }
  if (/boot|boots|hoka|anacapa/.test(normalized)) {
    return "boots";
  }
  if (/mule|loafer|espadrille|flat|boston/.test(normalized)) {
    return "mules";
  }
  if (/sandal|slide|heel|pump/.test(normalized)) {
    return "sandals";
  }
  if (/sneaker|trainer|runner|ballet|530|574|327|shoe/.test(normalized)) {
    return "sneakers";
  }
  if (/watch/.test(normalized)) {
    return "watches";
  }
  if (/jewelry|bracelet|ring|earring|necklace/.test(normalized)) {
    return "jewellery";
  }
  if (/scarf|belt|glasses|sunglasses|hair|perfume/.test(normalized)) {
    return "accessories";
  }
  if (/\b(hat|cap|caps|beanie)\b/.test(normalized)) {
    return "hats";
  }

  return fallbackCategory;
}

function stripBrandFromTitle(title, brand) {
  if (!brand) {
    return title;
  }

  const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return title.replace(new RegExp(escapedBrand, "ig"), "").trim();
}

function containsChineseCharacters(value) {
  return /[\u4e00-\u9fff]/.test(value);
}

function translateChineseFashionTitle(title, category) {
  let result = decodeHtml(title);

  const replacements = [
    [/爱马仕|Hermès/gi, "Hermes "],
    [/路易威登|Louis Vuitton|LV/gi, "Louis Vuitton "],
    [/古驰/gi, "Gucci "],
    [/缪缪|Miu Miu|MIU/gi, "Miu Miu "],
    [/巴黎世家|Balenciaga/gi, "Balenciaga "],
    [/新款/gi, "New "],
    [/经典/gi, "Classic "],
    [/凯莉扣/gi, "Kelly Buckle "],
    [/高跟/gi, "Heel "],
    [/凉鞋/gi, "Sandal "],
    [/拖鞋|半拖|H拖/gi, "Slide "],
    [/运动鞋/gi, "Sneaker "],
    [/芭蕾舞鞋/gi, "Ballet "],
    [/网面/gi, "Mesh "],
    [/手掌纹/gi, "Palm Grain "],
    [/渔夫鞋/gi, "Espadrille "],
    [/真皮/gi, "Leather "],
    [/防滑/gi, "Grip "],
    [/耐磨/gi, "Durable "],
    [/大底/gi, "Sole "],
    [/米白/gi, "Off White "],
    [/白色/gi, "White "],
    [/黑色/gi, "Black "],
    [/蓝色/gi, "Blue "],
    [/棕色/gi, "Brown "],
    [/深棕/gi, "Dark Brown "],
    [/浅棕/gi, "Light Brown "],
    [/米色/gi, "Beige "],
    [/粉色/gi, "Pink "],
    [/灰蓝/gi, "Grey Blue "],
    [/灰白/gi, "Grey White "],
    [/银黄/gi, "Silver Yellow "],
    [/银黑/gi, "Silver Black "],
    [/银色/gi, "Silver "],
    [/珍珠白皮面/gi, "Pearl White Leather "],
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  result = result.replace(/\b\d{2}\s*-\s*\d{2}\b/g, " ");
  result = result.replace(/\b\d{6,}\b/g, " ");
  result = result.replace(/\s+/g, " ").trim();

  if (containsChineseCharacters(result)) {
    return "";
  }

  return result || CATEGORY_NOUNS[category];
}

function buildSourceName(title, brand, category) {
  const decoded = decodeHtml(title);
  const sizeLabel = extractSizeLabel(decoded);
  let working = decoded
    .replace(sizeLabel, " ")
    .replace(/\b\d{6,}\b/g, " ")
    .replace(/1:1/gi, " ")
    .replace(/\bOri(?:ginar|ginal)?\b/gi, " ")
    .replace(/\bOriginal\b/gi, " ")
    .replace(/\bS-XL\b/gi, " ")
    .replace(/\bXXS-XXL\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (/https?:\/\//i.test(working)) {
    working = "";
  }

  if (containsChineseCharacters(working)) {
    working = translateChineseFashionTitle(working, category);
  }

  working = stripBrandFromTitle(working, brand)
    .replace(/\s+/g, " ")
    .trim();

  if (!working) {
    working = CATEGORY_NOUNS[category];
  } else if (/^\d+$/.test(working)) {
    working = `${CATEGORY_NOUNS[category]} ${working}`;
  }

  if (!working.toLowerCase().startsWith(brand.toLowerCase())) {
    working = `${brand} ${working}`.trim();
  }

  return working.replace(/\s+/g, " ").trim();
}

function extractSourcePriceRon(title) {
  const match = decodeHtml(title).match(
    /(?:¥|￥|RMB|CNY|yuan|元)\s*(\d{2,5})|(\d{2,5})\s*(?:RMB|CNY|yuan|元)/i,
  );

  if (!match) {
    return null;
  }

  const value = Number.parseInt(match[1] ?? match[2], 10);

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.round(value * 0.65);
}

function inferAudience(base, sizes) {
  if (base.audience) {
    return base.audience;
  }

  const text = decodeHtml(
    `${base.title} ${base.sourceCollection?.en ?? ""} ${base.sourceCollection?.ro ?? ""}`,
  ).toLowerCase();

  if (/\b(men|men's|male|barbati|bărbați)\b|38-46|39-45|40-46|41-46/.test(text)) {
    return "men";
  }

  if (/\b(women|women's|dama|femei)\b|35-41|35-40|36-41/.test(text)) {
    return "women";
  }

  if (
    base.source === "qiqiyg" &&
    ["dresses", "bags", "swimwear"].includes(base.defaultCategory)
  ) {
    return "women";
  }

  if (sizes.some((size) => Number(size) >= 44)) {
    return "men";
  }

  return "unisex";
}

function createSourceItem(base) {
  const sizeLabel = extractSizeLabel(base.title);
  const sizes = expandSizeLabel(sizeLabel);
  const brand = detectBrand(base.title, base.defaultBrand);
  const category = detectCategory(base.title, base.defaultCategory);
  const name = buildSourceName(base.title, brand, category);
  const tags = new Set(base.tags);

  if (category === "dresses" && /midi|maxi|zimmermann|prada/i.test(name)) {
    tags.add("modest");
  }

  return {
    id: `${base.source}-${safeId(`${brand}-${name}`)}-${hashString(base.href)}`,
    name,
    brand,
    category,
    source: base.source,
    href: base.href,
    image: base.image,
    photoCount: base.photoCount,
    sizes,
    sizeLabel,
    tags: Array.from(tags),
    sourceCollection: base.sourceCollection,
    originalTitle: base.title,
    audience: inferAudience(base, sizes),
    sourcePriceRon: extractSourcePriceRon(base.title),
  };
}

function parseQiqiygSourceItems(pageConfig, html) {
  const regex =
    /<div class="category_160">[\s\S]*?<a title="([^"]+)" href="([^"]+)">[\s\S]*?data-original="([^"]+)"[\s\S]*?<a href="[^"]+" title="[^"]+" class="brown_a">([^<]+)<\/a>\s*\((\d+)\)/gi;

  const items = [];
  let match;

  while ((match = regex.exec(html))) {
    const title = decodeHtml(match[4] || match[1]);
    items.push(
      createSourceItem({
        source: pageConfig.source,
        title,
        href: absoluteUrl(pageConfig.url, match[2]),
        image: absoluteUrl(pageConfig.url, match[3]),
        photoCount: Number.parseInt(match[5], 10) || null,
        sourceCollection: pageConfig.sourceCollection,
        defaultBrand: pageConfig.defaultBrand,
        defaultCategory: pageConfig.defaultCategory,
        tags: [...pageConfig.tags],
      }),
    );
  }

  return items;
}

function parseYupooSourceItems(pageConfig, html) {
  const regex =
    /<a\s+class="album__main"[\s\S]*?title="([^"]+)"[\s\S]*?href="([^"]+)"[\s\S]*?data-src="([^"]+)"[\s\S]*?<div class="text_overflow album__photonumber">(\d*)<\/div>[\s\S]*?<div class="text_overflow album__title">([^<]+)<\/div>/gi;

  const items = [];
  let match;

  while ((match = regex.exec(html))) {
    const title = decodeHtml(match[5] || match[1]);
    items.push(
      createSourceItem({
        source: pageConfig.source,
        title,
        href: absoluteUrl(pageConfig.url, match[2]),
        image: absoluteUrl(pageConfig.url, match[3]),
        photoCount: Number.parseInt(match[4], 10) || null,
        sourceCollection: pageConfig.sourceCollection,
        defaultBrand: pageConfig.defaultBrand,
        defaultCategory: pageConfig.defaultCategory,
        tags: [...pageConfig.tags],
      }),
    );
  }

  return items;
}

function uniqueBy(items, keySelector) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function normalizeImageExtension(url) {
  const pathname = new URL(url).pathname.toLowerCase();
  if (pathname.endsWith(".png")) {
    return ".png";
  }
  if (pathname.endsWith(".gif")) {
    return ".gif";
  }
  if (pathname.endsWith(".jpeg")) {
    return ".jpeg";
  }
  return ".jpg";
}

function getImageUrlCandidates(url) {
  const candidates = new Set([url.replace("://pic22.qiqiyg.com/", "://pic2.qiqiyg.com/")]);
  const parsed = new URL(url);

  if (
    parsed.hostname.endsWith("qiqiyg.com") &&
    parsed.pathname.startsWith("/upfile/")
  ) {
    candidates.add(`https://uspic.qiqiyg.com${parsed.pathname}`);
    candidates.add(`https://pic2.qiqiyg.com${parsed.pathname}`);
    candidates.add(`https://pic3.qiqiyg.com${parsed.pathname}`);
  }

  return Array.from(candidates).map((candidate) => candidate.replace(/([^:]\/)\/+/g, "$1"));
}

async function downloadImageIfNeeded(url, absoluteTargetPath) {
  if (!url) {
    return;
  }

  if (await hasFile(absoluteTargetPath)) {
    return;
  }

  await mkdir(path.dirname(absoluteTargetPath), { recursive: true });

  let lastError;

  for (const candidate of getImageUrlCandidates(url)) {
    try {
      const response = await fetch(candidate, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
          referer: "https://x.yupoo.com/",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download ${candidate}: ${response.status}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      await writeFile(absoluteTargetPath, buffer);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  console.warn(`Skipped unavailable image: ${url}`);
  if (lastError) {
    console.warn(lastError.message);
  }
}

async function withConcurrency(items, limit, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item) {
        await worker(item);
      }
    }
  });
  await Promise.all(runners);
}

async function localizeCollectionImages(items) {
  const output = [];
  const downloads = [];

  for (const item of items) {
    if (!item.image) {
      continue;
    }
    const extension = normalizeImageExtension(item.image);
    const relativePath = `/source-collections/${item.source}/${item.id}${extension}`;
    const targetPath = path.join(collectionsImageDir, item.source, `${item.id}${extension}`);
    output.push({ item: { ...item, image: relativePath }, targetPath });
    downloads.push({ url: item.image, targetPath });
  }

  await withConcurrency(downloads, 8, async (task) => {
    await downloadImageIfNeeded(task.url, task.targetPath);
  });

  const available = [];

  for (const entry of output) {
    if (await hasFile(entry.targetPath)) {
      available.push(entry.item);
    }
  }

  return available;
}

async function localizeSourceProductImages(items) {
  const output = [];
  const downloads = [];

  for (const item of items) {
    if (!item.image) {
      continue;
    }
    const extension = normalizeImageExtension(item.image);
    const relativePath = `/source-products/${item.source}/${item.id}${extension}`;
    const targetPath = path.join(
      sourceProductsImageDir,
      item.source,
      `${item.id}${extension}`,
    );
    output.push({ item: { ...item, image: relativePath }, targetPath });
    downloads.push({ url: item.image, targetPath });
  }

  await withConcurrency(downloads, 8, async (task) => {
    await downloadImageIfNeeded(task.url, task.targetPath);
  });

  const available = [];

  for (const entry of output) {
    if (await hasFile(entry.targetPath)) {
      available.push(entry.item);
    }
  }

  return available;
}

function renderCollectionData(items) {
  const sectionsTs = SECTION_DEFS.map(
    (section) => `  {
    id: '${section.id}',
    label: { en: '${escapeTs(section.label.en)}', ro: '${escapeTs(section.label.ro)}' },
    description: { en: '${escapeTs(section.description.en)}', ro: '${escapeTs(section.description.ro)}' },
  }`,
  ).join(",\n");

  const sourceLabelsTs = Object.entries(SOURCE_LABELS)
    .map(
      ([key, value]) =>
        `  ${key === "198maoyi" ? "'198maoyi'" : key}: { en: '${escapeTs(
          value.en,
        )}', ro: '${escapeTs(value.ro)}' }`,
    )
    .join(",\n");

  const itemsTs = items
    .map(
      (item) => `  {
    id: '${escapeTs(item.id)}',
    name: { en: '${escapeTs(item.name.en)}', ro: '${escapeTs(item.name.ro)}' },
    source: '${item.source}',
    section: '${item.section}',
    href: '${escapeTs(item.href)}',
    image: '${escapeTs(item.image)}',
    count: ${item.count ?? "null"},
    featured: ${item.featured ? "true" : "false"},
    tags: [${item.tags.map((tag) => `'${escapeTs(tag)}'`).join(", ")}],
  }`,
    )
    .join(",\n");

  return `import type { LocalizedText } from '@/lib/i18n';

export type CatalogSectionId =
  | 'dresses'
  | 'clothing'
  | 'bags'
  | 'shoes'
  | 'accessories'
  | 'swimwear';

export type CatalogSourceId =
  | 'qiqiyg'
  | 'weifeng'
  | 'deshengxing'
  | '198maoyi';

export interface CatalogSection {
  id: CatalogSectionId;
  label: LocalizedText;
  description: LocalizedText;
}

export interface CatalogCollection {
  id: string;
  name: LocalizedText;
  source: CatalogSourceId;
  section: CatalogSectionId;
  href: string;
  image: string;
  count: number | null;
  featured: boolean;
  tags: string[];
}

export const catalogSections: CatalogSection[] = [
${sectionsTs}
];

export const catalogSourceLabels: Record<CatalogSourceId, LocalizedText> = {
${sourceLabelsTs}
};

export const womenCatalogCollections: CatalogCollection[] = [
${itemsTs}
];
`;
}

function renderSourceProductsData(items) {
  return JSON.stringify(items, null, 2);
}

async function main() {
  await mkdir(collectionsImageDir, { recursive: true });
  await mkdir(sourceProductsImageDir, { recursive: true });
  await mkdir(sourceDataDir, { recursive: true });

  const qiqiygCollections = [];
  for (const source of QIQIYG_COLLECTION_SOURCES) {
    const html = await readCachedOrFetch(source.cacheName, source.url);
    qiqiygCollections.push(
      ...parseQiqiygCollections(
        html,
        source.url,
        source.source,
        source.section,
        source.filter,
        source.transform,
      ),
    );
  }

  const weifengCollections = await Promise.all(
    WEIFENG_CONFIG.map((config) =>
      buildYupooCollection(config, "https://weifengfz.x.yupoo.com", "weifeng"),
    ),
  );

  const deshengxingCollections = await Promise.all(
    DESHENGXING_CONFIG.map((config) =>
      buildYupooCollection(
        config,
        "https://deshengxing.x.yupoo.com",
        "deshengxing",
      ),
    ),
  );

  const maoyiCollections = await Promise.all(
    MAOYI_CONFIG.map((config) =>
      buildYupooCollection(config, "https://198maoyi.x.yupoo.com", "198maoyi"),
    ),
  );

  const collectionItems = uniqueBy(
    [
      ...qiqiygCollections,
      ...weifengCollections,
      ...deshengxingCollections,
      ...maoyiCollections,
    ].filter((item) => Boolean(item.image)),
    (item) => item.id,
  ).sort((left, right) => {
    if (left.section !== right.section) {
      return left.section.localeCompare(right.section);
    }
    if (left.featured !== right.featured) {
      return left.featured ? -1 : 1;
    }
    return (right.count ?? 0) - (left.count ?? 0);
  });

  const localizedCollectionItems = await localizeCollectionImages(collectionItems);

  const sourceProducts = [];
  const productPages = uniqueBy(
    [...SOURCE_PRODUCT_PAGES, ...EXTRA_SOURCE_PRODUCT_PAGES],
    (page) => `${page.source}:${page.url}`,
  );

  for (const page of productPages) {
    const html = await readCachedOrFetch(page.cacheName, page.url);
    const parsed =
      page.kind === "qiqiyg"
        ? parseQiqiygSourceItems(page, html)
        : parseYupooSourceItems(page, html);
    sourceProducts.push(...parsed);
  }

  const localizedSourceProducts = await localizeSourceProductImages(
    uniqueBy(sourceProducts, (item) => item.href).sort((left, right) => {
      if (left.category !== right.category) {
        return left.category.localeCompare(right.category);
      }
      if (left.brand !== right.brand) {
        return left.brand.localeCompare(right.brand);
      }
      return left.name.localeCompare(right.name);
    }),
  );

  await writeFile(
    catalogOutputPath,
    renderCollectionData(localizedCollectionItems),
    "utf8",
  );
  await writeFile(
    sourceProductsOutputPath,
    renderSourceProductsData(localizedSourceProducts),
    "utf8",
  );

  console.log(
    `Generated ${localizedCollectionItems.length} collection cards and ${localizedSourceProducts.length} imported source items.`,
  );
}

void main();
