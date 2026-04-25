import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import CatalogImage from "@/components/CatalogImage";
import {
  CatalogCollection,
  catalogSourceLabels,
} from "@/data/women-catalog";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedText } from "@/lib/i18n";
import { getCatalogCollectionPath } from "@/lib/source-catalog";

interface CatalogCollectionCardProps {
  collection: CatalogCollection;
  index?: number;
}

const CatalogCollectionCard = ({
  collection,
  index = 0,
}: CatalogCollectionCardProps) => {
  const { lang, t } = useLanguage();
  const sourceLabel = getLocalizedText(
    catalogSourceLabels[collection.source],
    lang,
  );
  const styleCount =
    collection.count !== null
      ? t("sourceCatalog.styles", { count: collection.count })
      : t("sourceCatalog.openCollection");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
    >
      <Link to={getCatalogCollectionPath(collection.id)} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="aspect-[4/5] overflow-hidden bg-[#f7f1e7]">
            <CatalogImage
              src={collection.image}
              alt={getLocalizedText(collection.name, lang)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
            <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.24em] backdrop-blur-sm">
              {sourceLabel}
            </span>
            {collection.tags.includes("modest") ? (
              <span className="rounded-full bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-primary-foreground">
                {t("sourceCatalog.modestTitle")}
              </span>
            ) : null}
          </div>

          <div className="p-5">
            <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-gold">
              {styleCount}
            </p>
            <h3 className="text-base font-medium leading-snug md:text-lg">
              {getLocalizedText(collection.name, lang)}
            </h3>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-gold">
              {t("sourceCatalog.viewCollection")}
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CatalogCollectionCard;
