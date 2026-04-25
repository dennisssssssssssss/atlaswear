import { siteConfig } from "@/config/site";
import { getCatalogCategoryLabel, type CatalogProduct } from "@/lib/catalog";
import type { Lang } from "@/lib/i18n";

const buildInquiryMessage = (
  product: CatalogProduct,
  lang: Lang,
  selectedSize?: string,
) => {
  const lines = [
    lang === "ro"
      ? "Salut, vreau sa comand acest produs:"
      : "Hello, I want to order this item:",
    `${product.brand} ${product.name}`,
    `${lang === "ro" ? "Categorie" : "Category"}: ${getCatalogCategoryLabel(product.category, lang)}`,
  ];

  if (selectedSize) {
    lines.push(`${lang === "ro" ? "Marime" : "Size"}: ${selectedSize}`);
  }

  lines.push(
    lang === "ro"
      ? "Te rog sa imi confirmi disponibilitatea si termenul de livrare."
      : "Please confirm availability and shipping timing.",
  );

  return lines.join("\n");
};

export const buildProductWhatsappLink = (
  product: CatalogProduct,
  lang: Lang,
  selectedSize?: string,
) => {
  if (!siteConfig.contact.whatsappNumber) {
    return "";
  }

  const phoneNumber = siteConfig.contact.whatsappNumber.replace(/[^\d]/g, "");
  const message = buildInquiryMessage(product, lang, selectedSize);

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

export const getPreferredProductContactLink = (
  product: CatalogProduct,
  lang: Lang,
  selectedSize?: string,
) =>
  buildProductWhatsappLink(product, lang, selectedSize) || "/contact";
