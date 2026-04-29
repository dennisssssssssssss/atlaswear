import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://qiqiyg.com";
const REQUEST_DELAY_MS = 600;
const MAX_BATCH_PAGES = 3;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64)";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "qiqi-import.json");

const categories = [
  { id: "11", name: "T-Shirt" },
  { id: "10", name: "Polo Short" },
  { id: "394", name: "Jacket" },
  { id: "170", name: "Fashion Dress" },
  { id: "58658", name: "Bikini" },
  { id: "68696", name: "Ralph Lauren" },
  { id: "67580", name: "Lacoste" },
  { id: "1618", name: "Adidas Nike Jordan" },
  { id: "345535", name: "Kids", skip: true },
  { id: "139496", name: "High Quality" },
];

let lastRequestAt = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForRateLimit() {
  const elapsed = Date.now() - lastRequestAt;

  if (elapsed < REQUEST_DELAY_MS) {
    await delay(REQUEST_DELAY_MS - elapsed);
  }

  lastRequestAt = Date.now();
}

async function fetchHtml(url) {
  await waitForRateLimit();

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const buffer = await response.arrayBuffer();
  return new TextDecoder("gbk").decode(buffer);
}

function absoluteUrl(value, base = BASE_URL) {
  if (!value) {
    return "";
  }

  const normalized = decodeHtmlEntities(value.trim()).replace(/\\/g, "/");

  if (normalized.startsWith("//")) {
    return `https:${normalized}`;
  }

  return new URL(normalized, base).toString();
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function stripTags(value) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function cleanName(value) {
  return stripTags(value)
    .replace(/\s*[-|_]\s*qiqiyg.*$/i, "")
    .replace(/\s*[-|_]\s*qiqi.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getAttribute(tag, attribute) {
  const pattern = new RegExp(`${attribute}\\s*=\\s*(["'])(.*?)\\1`, "i");
  return tag.match(pattern)?.[2] ?? "";
}

function getMetaContent(html, key) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const property = getAttribute(tag, "property");
    const name = getAttribute(tag, "name");

    if (property.toLowerCase() === key.toLowerCase() || name.toLowerCase() === key.toLowerCase()) {
      return getAttribute(tag, "content");
    }
  }

  return "";
}

function mapCategory(categoryName) {
  const mapping = {
    "T-Shirt": { categoryHint: "clothing", audienceHint: "unisex" },
    "Polo Short": { categoryHint: "polo-shirts", audienceHint: "men" },
    "Jacket": { categoryHint: "jackets", audienceHint: "unisex" },
    "Fashion Dress": { categoryHint: "dresses", audienceHint: "women" },
    "Bikini": { categoryHint: "swimwear", audienceHint: "women" },
    "Ralph Lauren": {
      categoryHint: "polo-shirts",
      brandHint: "Ralph Lauren",
      audienceHint: "men",
    },
    "Lacoste": {
      categoryHint: "polo-shirts",
      brandHint: "Lacoste",
      audienceHint: "men",
    },
    "Adidas Nike Jordan": { categoryHint: "men-sneakers", audienceHint: "men" },
    "High Quality": { categoryHint: "clothing", audienceHint: "unisex" },
  };

  return mapping[categoryName] ?? {
    categoryHint: "clothing",
    audienceHint: "unisex",
  };
}

function getBatchPageUrls(categoryHtml, category) {
  const batchIds = new Set();
  const batchRegex = /producten_(\d+)_\d+\.html/gi;
  let match;

  while ((match = batchRegex.exec(categoryHtml)) !== null) {
    batchIds.add(match[1]);
  }

  const batchId = batchIds.values().next().value ?? category.id;

  return Array.from({ length: MAX_BATCH_PAGES }, (_, index) => {
    const page = index + 1;
    return `${BASE_URL}/producten_${batchId}_${page}.html`;
  });
}

function extractProductLinks(html, pageUrl) {
  const products = new Map();
  const anchorRegex =
    /<a\b[^>]*href\s*=\s*(["']?)([^"'\s>]*productinfoen_(\d+)\.html[^"'\s>]*)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = anchorRegex.exec(html)) !== null) {
    const href = match[2];
    const sourceId = match[3];
    const anchor = match[0];
    const body = match[4];
    const title = getAttribute(anchor, "title");
    const alt = getAttribute(anchor, "alt");
    const listName = cleanName(title || alt || body);

    products.set(sourceId, {
      sourceId,
      listName,
      url: absoluteUrl(href, pageUrl),
    });
  }

  const looseRegex = /productinfoen_(\d+)\.html/gi;

  while ((match = looseRegex.exec(html)) !== null) {
    const sourceId = match[1];

    if (!products.has(sourceId)) {
      products.set(sourceId, {
        sourceId,
        listName: "",
        url: `${BASE_URL}/productinfoen_${sourceId}.html`,
      });
    }
  }

  return [...products.values()];
}

function extractProductName(html, fallbackName, sourceId) {
  const candidates = [
    getMetaContent(html, "og:title"),
    html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "",
    html.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? "",
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "",
    fallbackName,
  ];

  for (const candidate of candidates) {
    const name = cleanName(candidate);

    if (name) {
      return name;
    }
  }

  return `Qiqi Product ${sourceId}`;
}

function extractImageUrl(html, pageUrl) {
  const ogImage = getMetaContent(html, "og:image");

  if (ogImage && /upfile\/product/i.test(ogImage)) {
    return absoluteUrl(ogImage, pageUrl);
  }

  const patterns = [
    /https?:\/\/[^"'\s<>]+\/upfile\/product\/[^"'\s<>]+?\.(?:jpg|jpeg|png|webp)/gi,
    /\/\/[^"'\s<>]+\/upfile\/product\/[^"'\s<>]+?\.(?:jpg|jpeg|png|webp)/gi,
    /(?:\.\.\/|\.\/|\/)?upfile\/product\/[^"'\s<>]+?\.(?:jpg|jpeg|png|webp)/gi,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(html);

    if (match?.[0]) {
      return absoluteUrl(match[0], pageUrl);
    }
  }

  return "";
}

async function scrapeProduct(productLink, category) {
  const detailHtml = await fetchHtml(productLink.url);
  const sourceName = extractProductName(
    detailHtml,
    productLink.listName,
    productLink.sourceId,
  );
  const imageUrl = extractImageUrl(detailHtml, productLink.url);

  if (!imageUrl) {
    console.warn(
      `Skipped product ${productLink.sourceId} (${sourceName}): image URL not found`,
    );
    return null;
  }

  return {
    sourceId: productLink.sourceId,
    sourceName,
    imageUrl,
    ...mapCategory(category.name),
  };
}

async function scrapeCategory(category) {
  if (category.skip) {
    console.log(`Skipping category ${category.id} ${category.name}`);
    return [];
  }

  const categoryUrl = `${BASE_URL}/categoryen_${category.id}.html`;
  console.log(`Scraping ${category.name} from ${categoryUrl}`);

  let categoryHtml = "";

  try {
    categoryHtml = await fetchHtml(categoryUrl);
  } catch (error) {
    console.warn(
      `Could not fetch category page ${categoryUrl}. Falling back to category id as batch id. ${error.message}`,
    );
  }

  const listUrls = getBatchPageUrls(categoryHtml, category);
  const entries = [];
  const seenProductIds = new Set();

  for (const listUrl of listUrls) {
    console.log(`Reading list page ${listUrl}`);

    let listHtml = "";

    try {
      listHtml = await fetchHtml(listUrl);
    } catch (error) {
      console.warn(`Skipped list page ${listUrl}: ${error.message}`);
      continue;
    }

    const productLinks = extractProductLinks(listHtml, listUrl);

    for (const productLink of productLinks) {
      if (seenProductIds.has(productLink.sourceId)) {
        continue;
      }

      seenProductIds.add(productLink.sourceId);

      try {
        const entry = await scrapeProduct(productLink, category);

        if (entry) {
          entries.push(entry);
        }
      } catch (error) {
        console.warn(
          `Skipped product ${productLink.sourceId}: ${error.message}`,
        );
      }
    }
  }

  return entries;
}

async function main() {
  const allEntries = [];
  const seenGlobalIds = new Set();

  for (const category of categories) {
    const entries = await scrapeCategory(category);

    for (const entry of entries) {
      if (seenGlobalIds.has(entry.sourceId)) {
        console.warn(`Skipped duplicate product ${entry.sourceId}`);
        continue;
      }

      seenGlobalIds.add(entry.sourceId);
      allEntries.push(entry);
    }
  }

  await writeFile(outputPath, `${JSON.stringify(allEntries, null, 2)}\n`, "utf8");
  console.log(`Wrote ${allEntries.length} products to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
