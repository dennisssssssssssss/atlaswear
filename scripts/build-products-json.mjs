import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createServer } from "vite";

import {
  auditCatalogProducts,
  buildQualityReport,
} from "./utils/catalogQuality.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, "../public/data");
const outputPath = path.join(outputDir, "products.json");
const reportsDir = path.resolve(__dirname, "../reports");
const reviewProductsPath = path.join(reportsDir, "review-products.json");
const qualityReportPath = path.join(reportsDir, "catalog-quality-report.json");
const sourceProductsPath = path.resolve(
  __dirname,
  "../public/source-data/source-products.json",
);

const server = await createServer({
  appType: "custom",
  logLevel: "error",
  server: {
    middlewareMode: true,
  },
});

try {
  const [
    { womenProducts },
    { menProducts },
    {
      attachRelatedProducts,
      mapProductToCatalogProduct,
      mapSourceProductToCatalogProduct,
    },
    sourceProductsRaw,
  ] = await Promise.all([
    server.ssrLoadModule("/src/data/women-products.ts"),
    server.ssrLoadModule("/src/data/men-products.ts"),
    server.ssrLoadModule("/src/lib/catalog.ts"),
    readFile(sourceProductsPath, "utf8"),
  ]);
  const sourceProducts = JSON.parse(sourceProductsRaw);

  if (!Array.isArray(sourceProducts)) {
    throw new TypeError(`${sourceProductsPath} must contain a JSON array`);
  }

  const normalizedProducts = [
    ...sourceProducts.map(mapSourceProductToCatalogProduct),
    ...[...womenProducts, ...menProducts].map(mapProductToCatalogProduct),
  ];
  const qualityAudit = auditCatalogProducts(normalizedProducts);
  const products = attachRelatedProducts(qualityAudit.approvedProducts);
  const reviewProducts = qualityAudit.reviewProducts;
  const qualityReport = buildQualityReport({
    sourceProducts,
    normalizedProducts,
    approvedProducts: products,
    reviewProducts,
    warningProducts: qualityAudit.warningProducts,
    duplicateIds: qualityAudit.duplicateIds,
  });

  await Promise.all([
    mkdir(outputDir, { recursive: true }),
    mkdir(reportsDir, { recursive: true }),
  ]);
  await Promise.all([
    writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8"),
    writeFile(
      reviewProductsPath,
      `${JSON.stringify(reviewProducts, null, 2)}\n`,
      "utf8",
    ),
    writeFile(
      qualityReportPath,
      `${JSON.stringify(qualityReport, null, 2)}\n`,
      "utf8",
    ),
  ]);

  console.log(`Wrote ${products.length} approved products to ${outputPath}`);
  console.log(
    `Quarantined ${reviewProducts.length} product(s) to ${reviewProductsPath}`,
  );
} finally {
  await server.close();
}
