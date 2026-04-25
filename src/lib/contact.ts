import { publicTelegramUrl, siteConfig } from "@/config/site";
import { getCategoryLabel, type Product } from "@/data/products";
import {
  sourceCategoryLabels,
  type SourceProduct,
} from "@/data/source-products";
import { catalogSourceLabels } from "@/data/women-catalog";
import type { Lang } from "@/lib/i18n";
import { getLocalizedText } from "@/lib/i18n";

const buildInquiryMessage = (
  product: Product,
  lang: Lang,
  selectedSize?: string,
) => {
  const lines = [
    lang === "ro" ? "Salut, vreau sa comand acest produs:" : "Hello, I want to order this item:",
    `${product.brand} ${product.name}`,
    `${lang === "ro" ? "Categorie" : "Category"}: ${getCategoryLabel(product.category, lang)}`,
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
  product: Product,
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

export const buildProductTelegramLink = (
  product: Product,
  lang: Lang,
  selectedSize?: string,
) => {
  if (!publicTelegramUrl) {
    return "";
  }

  const separator = publicTelegramUrl.includes("?") ? "&" : "?";
  return `${publicTelegramUrl}${separator}text=${encodeURIComponent(
    buildInquiryMessage(product, lang, selectedSize),
  )}`;
};

const buildSourceInquiryMessage = (
  product: SourceProduct,
  lang: Lang,
  selectedSize?: string,
) => {
  const lines = [
    lang === "ro"
      ? "Salut, vreau sa comand acest produs din catalog:"
      : "Hello, I want to order this catalog item:",
    `${product.brand} ${product.name}`,
    `${
      lang === "ro" ? "Categorie" : "Category"
    }: ${getLocalizedText(sourceCategoryLabels[product.category], lang)}`,
    `${lang === "ro" ? "Sursa" : "Source"}: ${getLocalizedText(
      catalogSourceLabels[product.source],
      lang,
    )}`,
  ];

  if (selectedSize) {
    lines.push(`${lang === "ro" ? "Marime" : "Size"}: ${selectedSize}`);
  }

  lines.push(
    lang === "ro"
      ? "Te rog sa imi confirmi disponibilitatea, pretul final si termenul de livrare."
      : "Please confirm availability, final price, and shipping timing.",
  );

  return lines.join("\n");
};

export const buildSourceProductWhatsappLink = (
  product: SourceProduct,
  lang: Lang,
  selectedSize?: string,
) => {
  if (!siteConfig.contact.whatsappNumber) {
    return "";
  }

  const phoneNumber = siteConfig.contact.whatsappNumber.replace(/[^\d]/g, "");
  const message = buildSourceInquiryMessage(product, lang, selectedSize);

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

export const buildSourceProductTelegramLink = (
  product: SourceProduct,
  lang: Lang,
  selectedSize?: string,
) => {
  if (!publicTelegramUrl) {
    return "";
  }

  const separator = publicTelegramUrl.includes("?") ? "&" : "?";
  return `${publicTelegramUrl}${separator}text=${encodeURIComponent(
    buildSourceInquiryMessage(product, lang, selectedSize),
  )}`;
};

export const getPreferredProductContactLink = (
  product: Product,
  lang: Lang,
  selectedSize?: string,
) =>
  buildProductWhatsappLink(product, lang, selectedSize) ||
  buildProductTelegramLink(product, lang, selectedSize) ||
  "/contact";
