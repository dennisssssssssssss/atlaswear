import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import CatalogImage from "@/components/CatalogImage";
import SourceProductCard from "@/components/SourceProductCard";
import { Button } from "@/components/ui/button";
import {
  catalogSections,
  catalogSourceLabels,
  womenCatalogCollections,
} from "@/data/women-catalog";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSourceProducts } from "@/hooks/use-source-products";
import { getLocalizedText } from "@/lib/i18n";
import { getCollectionCategories, getCollectionMatches } from "@/lib/source-catalog";

const CatalogCollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sourceProducts = [], isLoading } = useSourceProducts();
  const { lang, t } = useLanguage();

  const collection = womenCatalogCollections.find((entry) => entry.id === id);
  const section = collection
    ? catalogSections.find((entry) => entry.id === collection.section)
    : null;

  const relatedItems = useMemo(() => {
    if (!collection) {
      return [];
    }

    return getCollectionMatches(collection, sourceProducts).slice(0, 24);
  }, [collection, sourceProducts]);

  usePageMeta({
    title: collection
      ? getLocalizedText(collection.name, lang)
      : t("sourceCatalog.collectionNotFoundTitle"),
    description: collection
      ? t("sourceCatalog.collectionMetaDescription", {
          source: getLocalizedText(catalogSourceLabels[collection.source], lang),
          section: section ? getLocalizedText(section.label, lang) : "",
        })
      : t("sourceCatalog.description"),
    path: collection ? `/catalog/collection/${collection.id}` : "/catalog",
    image: collection?.image,
    noindex: !collection,
  });

  if (!collection) {
    return (
      <div className="min-h-screen bg-background px-4 pb-20 pt-32 text-foreground">
        <div className="container max-w-2xl rounded-[2rem] border border-border bg-card p-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">ATLAS</p>
          <h1 className="mt-4 font-heading text-4xl">
            {t("sourceCatalog.collectionNotFoundTitle")}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t("sourceCatalog.collectionNotFoundDescription")}
          </p>
          <Link
            to="/catalog"
            className="mt-8 inline-flex text-sm uppercase tracking-[0.22em] text-gold transition-colors hover:text-gold-light"
          >
            {t("sourceCatalog.backToCatalog")}
          </Link>
        </div>
      </div>
    );
  }

  const sourceLabel = getLocalizedText(catalogSourceLabels[collection.source], lang);
  const sectionLabel = section ? getLocalizedText(section.label, lang) : "";
  const categoryCount = getCollectionCategories(collection.section).length;

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-32 text-foreground">
      <div className="container">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} />
          {t("sourceCatalog.backToCatalog")}
        </Link>

        <div className="mt-8 grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] border border-border bg-card"
          >
            <div className="aspect-[4/5] overflow-hidden bg-[#f8f5ef]">
              <CatalogImage
                src={collection.image}
                alt={getLocalizedText(collection.name, lang)}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="rounded-[2rem] border border-border bg-card p-6 md:p-8"
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-gold">
                {sourceLabel}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground">
                {sectionLabel}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground">
                {categoryCount > 1
                  ? t("sourceCatalog.multiCategory")
                  : sectionLabel}
              </span>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {sourceLabel}
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight md:text-5xl">
              {getLocalizedText(collection.name, lang)}
            </h1>

            <p className="mt-5 text-base leading-8 text-muted-foreground">
              {t("sourceCatalog.collectionDetailDescription", {
                source: sourceLabel,
                section: sectionLabel,
              })}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-gold">
                  {t("sourceCatalog.collectionStat")}
                </p>
                <p className="mt-3 text-3xl font-heading">
                  {collection.count ?? "—"}
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-gold">
                  {t("sourceCatalog.relatedItemsCount")}
                </p>
                <p className="mt-3 text-3xl font-heading">{relatedItems.length}</p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-border bg-background/70 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {t("sourceCatalog.collectionCoverageTitle")}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t("sourceCatalog.collectionCoverageDescription")}
              </p>
            </div>

            <Button asChild variant="gold" className="mt-8">
              <Link to="/catalog">{t("sourceCatalog.collectionViewAll")}</Link>
            </Button>
          </motion.div>
        </div>

        <section className="border-t border-border pt-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("sourceCatalog.relatedItemsEyebrow")}
              </p>
              <h2 className="mt-3 font-heading text-3xl md:text-4xl">
                {t("sourceCatalog.relatedItemsTitle")}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {t("sourceCatalog.relatedItemsDescription")}
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={`collection-skeleton-${index}`}
                  className="h-[420px] animate-pulse rounded-3xl border border-border bg-card"
                />
              ))}
            </div>
          ) : relatedItems.length === 0 ? (
            <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
              <h2 className="font-heading text-3xl">
                {t("sourceCatalog.relatedItemsEmptyTitle")}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t("sourceCatalog.relatedItemsEmptyDescription")}
              </p>
              <Button asChild variant="gold" className="mt-6">
                <Link to="/catalog">{t("sourceCatalog.collectionViewAll")}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedItems.map((item, index) => (
                <SourceProductCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CatalogCollectionDetail;
