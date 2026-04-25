import { Link } from "react-router-dom";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import CatalogImage from "@/components/CatalogImage";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getCatalogCategoryLabel,
  type CatalogProduct,
} from "@/lib/catalog";
import { getPreferredProductContactLink } from "@/lib/contact";

interface ProductCardProps {
  product: CatalogProduct;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const { lang, t } = useLanguage();

  const imageClass =
    product.imageFit === "contain"
      ? "h-full w-full object-contain bg-[#f8f5ef] p-4"
      : "h-full w-full object-cover";

  const preferredOrderLink = getPreferredProductContactLink(product, lang);
  const orderButtonLabel = siteConfig.contact.whatsappNumber
    ? t("product.orderCtaWhatsApp")
    : t("product.orderCtaFallback");

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.02 }}
      className="flex h-full flex-col rounded-3xl border border-border bg-card p-4"
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-surface">
          <div className="aspect-[4/5] overflow-hidden">
            <CatalogImage
              src={product.images[0]}
              alt={`${product.brand} ${product.name}`}
              className={`${imageClass} transition-transform duration-700 group-hover:scale-105`}
              loading="lazy"
              fallbackClassName="p-4"
            />
          </div>

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-gold backdrop-blur">
              {getCatalogCategoryLabel(product.category, lang)}
            </span>
            <span className="rounded-full border border-border bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground backdrop-blur">
              {t("common.authenticSealed")}
            </span>
            {product.bestPrice ? (
              <span className="rounded-full bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-primary-foreground">
                {t("common.bestPrice")}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {product.brand}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="mt-2 inline-flex items-start gap-2 font-heading text-xl leading-tight transition-colors hover:text-gold"
        >
          <span>{product.name}</span>
          <ArrowUpRight size={18} className="mt-1 shrink-0" />
        </Link>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg text-foreground">
            {formatPrice(product.priceRon)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.compareAtRon)}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={preferredOrderLink}
              target={preferredOrderLink.startsWith("http") ? "_blank" : undefined}
              rel={preferredOrderLink.startsWith("http") ? "noreferrer" : undefined}
              className="sm:flex-1"
            >
              <Button
                variant="gold"
                className="w-full whitespace-normal text-center leading-5"
              >
                {orderButtonLabel}
              </Button>
            </a>
            <Link to={`/product/${product.id}`} className="sm:flex-1">
              <Button
                variant="gold-outline"
                className="w-full whitespace-normal text-center leading-5"
              >
                {t("common.viewDetails")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
