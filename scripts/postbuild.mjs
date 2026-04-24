import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

const siteUrl = (process.env.VITE_SITE_URL || "https://atlaswear.lovable.app").replace(
  /\/$/,
  "",
);

const routes = [
  "/",
  "/catalog",
  "/shop",
  "/shop?category=dresses",
  "/shop?category=clothing",
  "/shop?category=bags",
  "/shop?category=shoes",
  "/contact",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
];

mkdirSync(distDir, { recursive: true });
copyFileSync(path.join(distDir, "index.html"), path.join(distDir, "404.html"));

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
