import { Link } from "react-router-dom";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

import CatalogImage from "@/components/CatalogImage";
import { Button } from "@/components/ui/button";
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
  const orderButtonLabel = t("product.orderCtaFallback");

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.02 }}
      className="flex h-full min-w-0 flex-col rounded-lg border border-border bg-card p-3 sm:p-4"
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded-md bg-surface">
          <div className="aspect-[4/5] overflow-hidden">
            <CatalogImage
              src={product.images[0]}
              alt={`${product.brand} ${product.name}`}
              className={`${imageClass} transition-transform duration-700 group-hover:scale-105`}
              loading="lazy"
              fallbackClassName="p-4"
            />
          </div>

          <div className="absolute left-2 right-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:right-3 sm:top-3 sm:gap-2">
            <span className="max-w-full truncate rounded-full border border-border bg-background/90 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-gold backdrop-blur sm:px-3 sm:text-[10px] sm:tracking-[0.24em]">
              {getCatalogCategoryLabel(product.category, lang)}
            </span>
            <span className="hidden rounded-full border border-border bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground backdrop-blur sm:inline-flex">
              {t("common.authenticSealed")}
            </span>
            {product.bestPrice ? (
              <span className="max-w-full truncate rounded-full bg-gold px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-primary-foreground sm:px-3 sm:text-[10px] sm:tracking-[0.24em]">
                {t("common.bestPrice")}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="truncate text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.24em]">
          {product.brand}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="mt-2 inline-flex min-w-0 max-w-full items-start gap-1 font-heading text-base leading-tight transition-colors hover:text-gold sm:gap-2 sm:text-xl"
        >
          <span className="min-w-0 break-words">{product.name}</span>
          <ArrowUpRight size={16} className="mt-1 shrink-0 sm:h-[18px] sm:w-[18px]" />
        </Link>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm text-foreground sm:text-lg">
            {formatPrice(product.priceRon)}
          </span>
          <span className="text-xs text-muted-foreground line-through sm:text-sm">
            {formatPrice(product.compareAtRon)}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            {preferredOrderLink.startsWith("http") ? (
              <a
                href={preferredOrderLink}
                target="_blank"
                rel="noreferrer"
                className="sm:flex-1"
              >
                <Button
                  variant="gold"
                  className="min-h-11 w-full whitespace-normal px-2 text-center text-[10px] leading-5 tracking-[0.08em] sm:text-sm sm:tracking-wider"
                >
                  <MessageCircle size={16} />
                  {orderButtonLabel}
                </Button>
              </a>
            ) : (
              <Link to="/contact" className="sm:flex-1">
                <Button
                  variant="gold"
                  className="min-h-11 w-full whitespace-normal px-2 text-center text-[10px] leading-5 tracking-[0.08em] sm:text-sm sm:tracking-wider"
                >
                  <MessageCircle size={16} />
                  {orderButtonLabel}
                </Button>
              </Link>
            )}
            <Link to={`/product/${product.id}`} className="sm:flex-1">
              <Button
                variant="gold-outline"
                className="min-h-11 w-full whitespace-normal px-2 text-center text-[10px] leading-5 tracking-[0.08em] sm:text-sm sm:tracking-wider"
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
