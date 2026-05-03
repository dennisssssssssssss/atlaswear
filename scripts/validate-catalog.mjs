import { readFile } from "node:fs/promises";

import {
  auditCatalogProducts,
  buildQualityReport,
} from "./utils/catalogQuality.mjs";

const sourceProductsPath = "public/source-data/source-products.json";
const productsPath = "public/data/products.json";
const reviewProductsPath = "reports/review-products.json";

const sourceProducts = JSON.parse(await readFile(sourceProductsPath, "utf8"));
const products = JSON.parse(await readFile(productsPath, "utf8"));
const reviewProducts = JSON.parse(await readFile(reviewProductsPath, "utf8"));
const audit = auditCatalogProducts(products);
const report = buildQualityReport({
  sourceProducts,
  normalizedProducts: [...products, ...reviewProducts],
  approvedProducts: products,
  reviewProducts,
  warningProducts: audit.warningProducts,
  duplicateIds: audit.duplicateIds,
});

console.log(JSON.stringify(report, null, 2));

if (audit.reviewProducts.length > 0 || audit.duplicateIds.length > 0) {
  console.error(
    `Catalog validation failed: ${audit.reviewProducts.length} public product(s) need review.`,
  );
  process.exitCode = 1;
} else {
  console.log("Catalog validation passed.");
}
