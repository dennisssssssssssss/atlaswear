import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import CatalogImage from "@/components/CatalogImage";
import { Button } from "@/components/ui/button";
import { catalogSourceLabels } from "@/data/women-catalog";
import {
  sourceCategoryLabels,
  type SourceProduct,
} from "@/data/source-products";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedText } from "@/lib/i18n";
import { getSourceProductPath } from "@/lib/source-catalog";

interface SourceProductCardProps {
  item: SourceProduct;
  index?: number;
}

const SourceProductCard = ({ item, index = 0 }: SourceProductCardProps) => {
  const { lang, t } = useLanguage();
  const sourceLabel = getLocalizedText(catalogSourceLabels[item.source], lang);
  const categoryLabel = getLocalizedText(sourceCategoryLabels[item.category], lang);
  const photoCountLabel =
    item.photoCount === 1
      ? t("sourceCatalog.photoCountSingle", { count: 1 })
      : t("sourceCatalog.photoCount", { count: item.photoCount ?? 0 });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.02 }}
      className="rounded-3xl border border-border bg-card p-4"
    >
      <Link to={getSourceProductPath(item.id)} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-surface">
          <div className="aspect-[4/5] overflow-hidden bg-[#f8f5ef]">
            <CatalogImage
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
              fallbackClassName="p-4"
            />
          </div>

          <div className="absolute left-3 right-3 top-3 flex flex-wrap items-start justify-between gap-2">
            <span className="rounded-full border border-border bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-gold backdrop-blur">
              {sourceLabel}
            </span>
            <span className="rounded-full border border-border bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground backdrop-blur">
              {categoryLabel}
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {item.brand}
        </p>
        <Link
          to={getSourceProductPath(item.id)}
          className="mt-2 block font-heading text-xl leading-tight transition-colors hover:text-gold"
        >
          {item.name}
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">
          {getLocalizedText(item.sourceCollection, lang)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {item.sizeLabel ? (
            <span className="rounded-full border border-border px-3 py-1">
              {t("sourceCatalog.size")}: {item.sizeLabel}
            </span>
          ) : null}
          {item.photoCount !== null ? (
            <span className="rounded-full border border-border px-3 py-1">
              {photoCountLabel}
            </span>
          ) : null}
          {item.tags.includes("modest") ? (
            <span className="rounded-full border border-gold px-3 py-1 text-gold">
              {t("sourceCatalog.modestTitle")}
            </span>
          ) : null}
        </div>

        <Button asChild variant="gold-outline" className="mt-5 w-full">
          <Link to={getSourceProductPath(item.id)}>
            {t("sourceCatalog.viewItem")}
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
};

export default SourceProductCard;
