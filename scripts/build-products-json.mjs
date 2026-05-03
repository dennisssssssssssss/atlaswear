import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, "../public/data");
const outputPath = path.join(outputDir, "products.json");
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

  const products = attachRelatedProducts([
    ...sourceProducts.map(mapSourceProductToCatalogProduct),
    ...[...womenProducts, ...menProducts].map(mapProductToCatalogProduct),
  ]);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  console.log(`Wrote ${products.length} products to ${outputPath}`);
} finally {
  await server.close();
}
