import { readFile } from "node:fs/promises";

import { createServer } from "vite";

const sourceProductsPath = "public/source-data/source-products.json";
const productsPath = "public/data/products.json";

const knownCategories = new Set([
  "dresses",
  "clothing",
  "bags",
  "sneakers",
  "sandals",
  "mules",
  "boots",
  "swimwear",
  "accessories",
  "hats",
  "watches",
  "jewellery",
  "polo-shirts",
  "hoodies",
  "caps",
  "sunglasses",
  "men-sneakers",
  "men-watches",
  "jackets",
  "pants",
]);

const footwearPattern =
  /shoe|sneaker|trainer|runner|loafer|oxford|derby|moccasin|monk|brogue|boot|chelsea|sandal|slide|flip|heel|pump|stiletto|mule|flat/i;
const footwearCategories = new Set(["sneakers", "men-sneakers", "sandals", "mules", "boots"]);

const normalize = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const sourceText = (product) =>
  normalize(
    [
      product.name,
      product.originalTitle,
      product.href,
      product.sourceCollection?.en,
      product.sourceCollection?.ro,
    ].join(" "),
  );

const productText = (product) =>
  normalize([product.name, product.brand, product.category].join(" "));

const sourceContextText = (product) =>
  normalize([product.href, product.sourceCollection?.en, product.sourceCollection?.ro].join(" "));

const runtimeContextText = (product) =>
  normalize([product.sourceCollection?.en, product.sourceCollection?.ro].join(" "));

const countBy = (entries, keySelector) =>
  entries.reduce((counts, entry) => {
    const key = keySelector(entry) ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

const listUnknownCategories = (entries) =>
  entries
    .filter((entry) => !knownCategories.has(entry.category))
    .slice(0, 20)
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      category: entry.category,
    }));

const listFootwearInDresses = (entries, textSelector) =>
  entries
    .filter((entry) => entry.category === "dresses" && footwearPattern.test(textSelector(entry)))
    .slice(0, 30)
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      category: entry.category,
    }));

const listDressNamedOutsideDresses = (entries, textSelector) =>
  entries
    .filter((entry) => /dress/i.test(textSelector(entry)) && entry.category !== "dresses")
    .slice(0, 30)
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      category: entry.category,
    }));

const listContextMismatches = (entries, contextSelector, titleSelector) =>
  entries
    .flatMap((entry) => {
      const context = contextSelector(entry);
      const title = titleSelector(entry);
      const issues = [];

      if (/bags\.qiqiyg\.com|\bbags?\b|\bgenti\b/i.test(context) && entry.category !== "bags") {
        issues.push("bag-context");
      }

      if (/shoes\.qiqiyg\.com|\bshoes?\b|incaltaminte/i.test(context) && !footwearCategories.has(entry.category)) {
        issues.push("shoe-context");
      }

      if (/\bglasses\b|ochelari/i.test(context) && !["accessories", "sunglasses"].includes(entry.category)) {
        issues.push("glasses-context");
      }

      if (/jewellery|jewelry|bijuterii/i.test(context) && entry.category !== "jewellery") {
        issues.push("jewellery-context");
      }

      if (/watch|watches|ceasuri/i.test(context) && !["watches", "men-watches"].includes(entry.category)) {
        issues.push("watch-context");
      }

      if (
        /\bdresses\b|\brochii\b/i.test(context) &&
        footwearCategories.has(entry.category) &&
        !footwearPattern.test(title)
      ) {
        issues.push("dress-collection-footwear");
      }

      return issues.map((issue) => ({
        issue,
        id: entry.id,
        name: entry.name,
        category: entry.category,
      }));
    })
    .slice(0, 40);

const sourceProducts = JSON.parse(await readFile(sourceProductsPath, "utf8"));
const products = JSON.parse(await readFile(productsPath, "utf8"));

const server = await createServer({
  appType: "custom",
  logLevel: "error",
  server: {
    middlewareMode: true,
  },
});

let runtimeCatalogProducts;

try {
  const { mapSourceProductToCatalogProduct, mapProductToCatalogProduct } =
    await server.ssrLoadModule("/src/lib/catalog.ts");

  runtimeCatalogProducts = [
    ...sourceProducts.map(mapSourceProductToCatalogProduct),
    ...products.map(mapProductToCatalogProduct),
  ];
} finally {
  await server.close();
}

const rawSourceFootwearInDresses = listFootwearInDresses(sourceProducts, sourceText);
const runtimeFootwearInDresses = listFootwearInDresses(
  runtimeCatalogProducts,
  (product) => normalize([product.name, product.originalTitle, product.category].join(" ")),
);
const storefrontFootwearInDresses = listFootwearInDresses(products, productText);
const unknownSourceCategories = listUnknownCategories(sourceProducts);
const unknownStorefrontCategories = listUnknownCategories(products);
const unknownRuntimeCategories = listUnknownCategories(runtimeCatalogProducts);
const sourceContextMismatches = listContextMismatches(
  sourceProducts,
  sourceContextText,
  (product) => normalize(product.originalTitle),
);
const runtimeContextMismatches = listContextMismatches(
  runtimeCatalogProducts,
  runtimeContextText,
  (product) => normalize(product.originalTitle),
);

const summary = {
  sourceProducts: {
    total: sourceProducts.length,
    bySource: countBy(sourceProducts, (product) => product.source),
    byCategory: countBy(sourceProducts, (product) => product.category),
    dressNamedOutsideDresses: listDressNamedOutsideDresses(sourceProducts, (product) => product.name),
    footwearInDresses: rawSourceFootwearInDresses,
    contextMismatches: sourceContextMismatches,
    unknownCategories: unknownSourceCategories,
  },
  storefrontProducts: {
    total: products.length,
    byCategory: countBy(products, (product) => product.category),
    dressNamedOutsideDresses: listDressNamedOutsideDresses(products, (product) => product.name),
    footwearInDresses: storefrontFootwearInDresses,
    unknownCategories: unknownStorefrontCategories,
  },
  runtimeCatalog: {
    total: runtimeCatalogProducts.length,
    byCategory: countBy(runtimeCatalogProducts, (product) => product.category),
    footwearInDresses: runtimeFootwearInDresses,
    contextMismatches: runtimeContextMismatches,
    unknownCategories: unknownRuntimeCategories,
  },
};

console.log(JSON.stringify(summary, null, 2));

const failureCount =
  rawSourceFootwearInDresses.length +
  runtimeFootwearInDresses.length +
  storefrontFootwearInDresses.length +
  sourceContextMismatches.length +
  runtimeContextMismatches.length +
  unknownSourceCategories.length +
  unknownStorefrontCategories.length +
  unknownRuntimeCategories.length;

if (failureCount > 0) {
  console.error(`Catalog validation failed with ${failureCount} issue(s).`);
  process.exitCode = 1;
} else {
  console.log("Catalog validation passed.");
}
