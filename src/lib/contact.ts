import { siteConfig } from "@/config/site";
import type { CatalogProduct } from "@/lib/catalog";
import type { Lang } from "@/lib/i18n";

const buildInquiryMessage = (
  product: CatalogProduct,
  _lang: Lang,
  selectedSize?: string,
) => {
  const productUrl = `https://atlaswear.ro/product/${encodeURIComponent(product.id)}`;
  const lines = [
    "Buna ziua! Sunt interesat de:",
    "",
    `Produs: ${product.brand} ${product.name}`,
    `Marime: ${selectedSize || "-"}`,
    `Pret: ${product.priceRon} RON`,
    "Plata: ramburs la livrare",
    `Link: ${productUrl}`,
    "",
    "Astept detalii despre disponibilitate si livrare.",
    "Multumesc!",
  ];

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
