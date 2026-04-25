import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");
const indexHtmlPath = path.join(distDir, "index.html");

const siteUrl = (
  process.env.VITE_SITE_URL || "https://dennisssssssssssss.github.io/atlaswear"
).replace(/\/$/, "");

const routes = [
  "/",
  "/catalog",
  "/catalog/collection",
  "/catalog/item",
  "/shop",
  "/shop?category=dresses",
  "/shop?category=clothing",
  "/shop?category=bags",
  "/shop?category=sneakers",
  "/shop?category=sandals",
  "/shop?category=accessories",
  "/contact",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
];

mkdirSync(distDir, { recursive: true });
copyFileSync(indexHtmlPath, path.join(distDir, "404.html"));

routes
  .filter((route) => route !== "/" && !route.includes("?"))
  .forEach((route) => {
    const routeDir = path.join(distDir, route.replace(/^\//, ""));
    mkdirSync(routeDir, { recursive: true });
    copyFileSync(indexHtmlPath, path.join(routeDir, "index.html"));
  });

writeFileSync(
  path.join(distDir, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  "utf8",
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`)
  .join("\n")}
</urlset>
`;

writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf8");
