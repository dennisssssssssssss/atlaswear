import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, "../public/data");
const outputPath = path.join(outputDir, "products.json");

const server = await createServer({
  appType: "custom",
  logLevel: "error",
  server: {
    middlewareMode: true,
  },
});

try {
  const [{ womenProducts }, { menProducts }] = await Promise.all([
    server.ssrLoadModule("/src/data/women-products.ts"),
    server.ssrLoadModule("/src/data/men-products.ts"),
  ]);
  const products = [...womenProducts, ...menProducts];

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  console.log(`Wrote ${products.length} products to ${outputPath}`);
} finally {
  await server.close();
}
