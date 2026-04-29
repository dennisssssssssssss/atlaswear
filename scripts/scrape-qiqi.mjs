import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://qiqiyg.com";
const REQUEST_DELAY_MS = 800;
const MAX_PRODUCTS_PER_CATEGORY = 200;
const MAX_BATCH_PAGES = Number(process.env.QIQI_MAX_BATCH_PAGES ?? "0");
const MAX_PRODUCTS = Number(process.env.QIQI_MAX_PRODUCTS ?? "0");
const CATEGORY_IDS = new Set(
  (process.env.QIQI_CATEGORY_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);
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
const topCategoryIds = new Set([
  ...categories.map((category) => category.id),
  "3",
  "981",
]);

async function debugRawHtmlSample() {
  const testUrl = "https://qiqiyg.com/productinfoen_4820290.html";
  const response = await fetch(testUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  const buffer = await response.arrayBuffer();
  const html = new TextDecoder("gbk").decode(buffer);
  console.log("=== RAW HTML SAMPLE ===");
  console.log(html.substring(0, 3000));
  console.log("=== END SAMPLE ===");
  process.exit(0);
}

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
    .replace(/\s*-\s*Fashion.*$/i, "")
    .replace(/\s*[-|_]\s*qiqiyg.*$/i, "")
    .replace(/\s*[-|_]\s*qiqi.*$/i, "")
    .replace(/\s*\(\d+\)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isGenericProductName(value) {
  return /^(product\s+info|product|details?)$/i.test(value.trim());
}

function isWeakProductName(value) {
  return !value || isGenericProductName(value) || /^\d+$/.test(value.trim());
}

function extractImageFileName(src) {
  if (!src) {
    return "";
  }

  const fileName = decodeURIComponent(src.split(/[\\/]/).pop() ?? "");

  return cleanName(
    fileName
      .replace(/\.(?:jpg|jpeg|png|webp|gif)$/i, "")
      .replace(/_\d+$/i, ""),
  );
}

function normalizeGroupKey(value) {
  return cleanName(value)
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
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

function extractProductListLinks(html, baseUrl) {
  const links = new Map();
  const productListRegex =
    /href\s*=\s*(["'])([^"']*producten_(\d+)_(\d+)\.html(?:\?[^"']*)?)\1/gi;
  let match;

  while ((match = productListRegex.exec(html)) !== null) {
    const url = absoluteUrl(match[2], baseUrl);
    links.set(url, url);
  }

  return [...links.values()];
}

function extractCategoryLinks(html, baseUrl, currentCategoryId) {
  const links = new Map();
  const categoryRegex =
    /href\s*=\s*(["'])([^"']*categoryen_(\d+)\.html(?:\?[^"']*)?)\1/gi;
  let match;

  while ((match = categoryRegex.exec(html)) !== null) {
    const href = match[2];
    const categoryId = match[3];

    if (categoryId === currentCategoryId || topCategoryIds.has(categoryId)) {
      continue;
    }

    if (!href.includes("path=")) {
      continue;
    }

    const url = absoluteUrl(href, baseUrl);

    links.set(url, {
      categoryId,
      url,
    });
  }

  return [...links.values()];
}

function getBatchPageUrls(categoryHtml, category) {
  const batchIds = new Set();
  const batchRegex = /producten_(\d+)_\d+\.html/gi;
  let match;

  while ((match = batchRegex.exec(categoryHtml)) !== null) {
    batchIds.add(match[1]);
  }

  const batchId = batchIds.values().next().value ?? category.id;
  const fallbackPageCount = MAX_BATCH_PAGES > 0 ? MAX_BATCH_PAGES : 1;

  return Array.from({ length: fallbackPageCount }, (_, index) => {
    const page = index + 1;
    return `${BASE_URL}/producten_${batchId}_${page}.html`;
  });
}

async function* walkListPageUrls(categoryHtml, category, categoryUrl) {
  const categoryStack = [
    {
      category,
      depth: 0,
      html: categoryHtml,
      url: categoryUrl,
    },
  ];
  const visitedCategoryUrls = new Set([categoryUrl]);
  const yieldedListUrls = new Set();
  let yieldedAny = false;

  while (categoryStack.length > 0) {
    const current = categoryStack.pop();
    let currentHtml = current.html;

    if (!currentHtml) {
      try {
        currentHtml = await fetchHtml(current.url);
      } catch (error) {
        console.warn(`Skipped category discovery ${current.url}: ${error.message}`);
        continue;
      }
    }

    const directProductListLinks = extractProductListLinks(
      currentHtml,
      current.url,
    );

    if (directProductListLinks.length > 0) {
      for (const listUrl of directProductListLinks) {
        if (yieldedListUrls.has(listUrl)) {
          continue;
        }

        if (MAX_BATCH_PAGES > 0 && yieldedListUrls.size >= MAX_BATCH_PAGES) {
          return;
        }

        yieldedAny = true;
        yieldedListUrls.add(listUrl);
        yield listUrl;
      }

      continue;
    }

    if (current.depth >= 4) {
      continue;
    }

    const categoryLinks = extractCategoryLinks(
      currentHtml,
      current.url,
      current.category.id,
    );

    for (const link of categoryLinks.reverse()) {
      if (visitedCategoryUrls.has(link.url)) {
        continue;
      }

      visitedCategoryUrls.add(link.url);

      categoryStack.push({
        category: { ...category, id: link.categoryId },
        depth: current.depth + 1,
        url: link.url,
      });
    }
  }

  if (!yieldedAny) {
    for (const listUrl of getBatchPageUrls(categoryHtml, category)) {
      yield listUrl;
    }
  }
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
    const imageUrl = extractImageUrl(body, pageUrl);
    const listName = cleanName(
      title ||
        alt ||
        extractProductImageAlt(body) ||
        extractImageFileName(imageUrl) ||
        body,
    );

    const existingProduct = products.get(sourceId);
    const mergedImageUrl = existingProduct?.imageUrl || imageUrl;
    const mergedListName =
      existingProduct?.listName && !isWeakProductName(existingProduct.listName)
        ? existingProduct.listName
        : listName;

    products.set(sourceId, {
      sourceId,
      listName: mergedListName,
      imageUrl: mergedImageUrl,
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

function groupProductLinks(productLinks) {
  const groups = new Map();

  for (const productLink of productLinks) {
    const sourceName =
      productLink.listName || extractImageFileName(productLink.imageUrl);
    const groupKey =
      normalizeGroupKey(sourceName) || `product-${productLink.sourceId}`;
    const group = groups.get(groupKey) ?? {
      sourceId: productLink.sourceId,
      sourceName,
      productLinks: [],
      imageUrls: [],
    };

    group.productLinks.push(productLink);

    if (productLink.imageUrl && !group.imageUrls.includes(productLink.imageUrl)) {
      group.imageUrls.push(productLink.imageUrl);
    }

    if (!group.sourceName && sourceName) {
      group.sourceName = sourceName;
    }

    groups.set(groupKey, group);
  }

  return [...groups.values()];
}

function extractProductImageAlt(html) {
  const imgTags = html.match(/<img\b[\s\S]*?>/gi) ?? [];

  for (const tag of imgTags) {
    const src = getAttribute(tag, "data-original") || getAttribute(tag, "src");

    if (src && /upfile\/product/i.test(src)) {
      return getAttribute(tag, "alt");
    }
  }

  return "";
}

function extractProductName(html, fallbackName, sourceId) {
  const firstProductImageTag = (html.match(/<img\b[\s\S]*?>/gi) ?? []).find((tag) => {
    const src = getAttribute(tag, "src");
    return /upfile\/product/i.test(src);
  });
  const firstProductImageSrc = firstProductImageTag
    ? getAttribute(firstProductImageTag, "src")
    : "";
  const firstProductImageAlt = firstProductImageTag
    ? getAttribute(firstProductImageTag, "alt")
    : "";
  const candidates = [
    getMetaContent(html, "og:title"),
    html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "",
    html.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? "",
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "",
    firstProductImageAlt,
    extractImageFileName(firstProductImageSrc),
    fallbackName,
  ];

  for (const candidate of candidates) {
    const name = cleanName(candidate);

    if (name && !isGenericProductName(name)) {
      return name;
    }
  }

  return `Qiqi Product ${sourceId}`;
}

function extractImageUrls(html, pageUrl) {
  const ogImage = getMetaContent(html, "og:image");
  const imageUrls = [];
  const imageUrlKeys = new Set();

  const addImageUrl = (value) => {
    if (!value || !/upfile\/product/i.test(value)) {
      return;
    }

    const url = absoluteUrl(value, pageUrl);
    const key = decodeURIComponent(new URL(url).pathname).toLowerCase();

    if (!imageUrlKeys.has(key)) {
      imageUrlKeys.add(key);
      imageUrls.push(url);
    }
  };

  if (ogImage && /upfile\/product/i.test(ogImage)) {
    addImageUrl(ogImage);
  }

  const imgTags = html.match(/<img\b[\s\S]*?>/gi) ?? [];

  for (const tag of imgTags) {
    addImageUrl(getAttribute(tag, "data-original"));
    addImageUrl(getAttribute(tag, "src"));
  }

  const backgroundImageRegex = /background-image\s*:\s*url\(\s*(["']?)(.*?)\1\s*\)/gi;
  let backgroundMatch;

  while ((backgroundMatch = backgroundImageRegex.exec(html)) !== null) {
    addImageUrl(backgroundMatch[2]);
  }

  if (imageUrls.length === 0) {
    const patterns = [
      /https?:\/\/[^"'<>\r\n]+\/upfile\/product\/[^"'<>\r\n]+?\.(?:jpg|jpeg|png|webp|gif)/gi,
      /\/\/[^"'<>\r\n]+\/upfile\/product\/[^"'<>\r\n]+?\.(?:jpg|jpeg|png|webp|gif)/gi,
      /(?:\.\.\/|\.\/|\/)?upfile\/product\/[^"'<>\r\n]+?\.(?:jpg|jpeg|png|webp|gif)/gi,
    ];

    for (const pattern of patterns) {
      let match;

      while ((match = pattern.exec(html)) !== null) {
        addImageUrl(match[0]);
      }
    }
  }

  return imageUrls;
}

function extractImageUrl(html, pageUrl) {
  return extractImageUrls(html, pageUrl)[0] ?? "";
}

async function scrapeProductGroup(productGroup, category) {
  const primaryLink = productGroup.productLinks[0];
  const shouldFetchDetail =
    process.env.QIQI_FETCH_DETAILS === "1" ||
    isWeakProductName(productGroup.sourceName) ||
    productGroup.imageUrls.length === 0;
  const detailHtml = shouldFetchDetail ? await fetchHtml(primaryLink.url) : "";
  const sourceName = shouldFetchDetail
    ? extractProductName(
        detailHtml,
        productGroup.sourceName || primaryLink.listName,
        productGroup.sourceId,
      )
    : productGroup.sourceName;
  const detailImageUrls = shouldFetchDetail
    ? extractImageUrls(detailHtml, primaryLink.url)
    : [];
  const imageUrls = [...productGroup.imageUrls, ...detailImageUrls].filter(
    (imageUrl, index, entries) => imageUrl && entries.indexOf(imageUrl) === index,
  );
  const imageUrl = imageUrls[0] ?? "";

  if (!imageUrl) {
    console.warn(
      `Skipped product ${productGroup.sourceId} (${sourceName}): image URL not found`,
    );
    return null;
  }

  return {
    sourceId: productGroup.sourceId,
    sourceName,
    imageUrl,
    imageUrls,
    ...mapCategory(category.name),
  };
}

async function scrapeCategory(
  category,
  maxProducts = MAX_PRODUCTS_PER_CATEGORY,
  onEntry = async () => {},
) {
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

  const entries = [];
  let listPageCount = 0;
  const seenProductIds = new Set();
  const finishCategory = (reason = "") => {
    const suffix = reason ? ` (${reason})` : "";

    console.log(
      `Finished ${category.name}: read ${listPageCount} list pages, collected ${entries.length} products${suffix}`,
    );

    return entries;
  };

  for await (const listUrl of walkListPageUrls(categoryHtml, category, categoryUrl)) {
    if (entries.length >= maxProducts) {
      return finishCategory("limit reached");
    }

    listPageCount += 1;
    console.log(`Reading list page ${listUrl}`);

    let listHtml = "";

    try {
      listHtml = await fetchHtml(listUrl);
    } catch (error) {
      console.warn(`Skipped list page ${listUrl}: ${error.message}`);
      continue;
    }

    const productLinks = extractProductLinks(listHtml, listUrl);
    const productGroups = groupProductLinks(productLinks);

    for (const productGroup of productGroups) {
      if (entries.length >= maxProducts) {
        return finishCategory("limit reached");
      }

      if (seenProductIds.has(productGroup.sourceId)) {
        continue;
      }

      seenProductIds.add(productGroup.sourceId);

      try {
        const entry = await scrapeProductGroup(productGroup, category);

        if (entry) {
          entries.push(entry);
          await onEntry(entry, category);
        }

        if (entries.length >= maxProducts) {
          return finishCategory("limit reached");
        }
      } catch (error) {
        console.warn(
          `Skipped product ${productGroup.sourceId}: ${error.message}`,
        );
      }
    }
  }

  return finishCategory();
}

async function writeImportFile(entries, label = "checkpoint") {
  await writeFile(outputPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
  console.log(`Saved ${label}: ${entries.length} products to ${outputPath}`);
}

async function main() {
  const allEntries = [];
  const seenGlobalIds = new Set();
  const selectedCategories = categories.filter(
    (category) => CATEGORY_IDS.size === 0 || CATEGORY_IDS.has(category.id),
  );

  for (const category of selectedCategories) {
    const remainingGlobalLimit =
      MAX_PRODUCTS > 0
        ? Math.max(MAX_PRODUCTS - allEntries.length, 0)
        : Number.POSITIVE_INFINITY;

    if (remainingGlobalLimit === 0) {
      break;
    }

    await scrapeCategory(
      category,
      Math.min(MAX_PRODUCTS_PER_CATEGORY, remainingGlobalLimit),
      async (entry) => {
        if (MAX_PRODUCTS > 0 && allEntries.length >= MAX_PRODUCTS) {
          return;
        }

        if (seenGlobalIds.has(entry.sourceId)) {
          console.warn(`Skipped duplicate product ${entry.sourceId}`);
          return;
        }

        seenGlobalIds.add(entry.sourceId);
        allEntries.push(entry);

        if (allEntries.length % 50 === 0) {
          await writeImportFile(allEntries, "checkpoint");
        }
      },
    );
  }

  await writeImportFile(allEntries, "final import");
}

if (process.env.QIQI_DEBUG_SAMPLE === "1") {
  await debugRawHtmlSample();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
