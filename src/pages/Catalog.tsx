import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { motion } from "framer-motion";

import CatalogCollectionCard from "@/components/CatalogCollectionCard";
import SourceProductCard from "@/components/SourceProductCard";
import { Button } from "@/components/ui/button";
import {
  sourceCategoryLabels,
  type SourceCategory,
} from "@/data/source-products";
import {
  catalogSourceLabels,
  womenCatalogCollections,
} from "@/data/women-catalog";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSourceProducts } from "@/hooks/use-source-products";
import { getLocalizedText } from "@/lib/i18n";
import { getCollectionCategories } from "@/lib/source-catalog";
import { cn } from "@/lib/utils";

const Catalog = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: sourceProducts = [], isLoading, isError } = useSourceProducts();

  const activeCategory = searchParams.get("category") as SourceCategory | null;
  const activeBrand = searchParams.get("brand");
  const activeSource = searchParams.get("source");
  const query = searchParams.get("q") ?? "";

  const categoryIds = useMemo(
    () =>
      Array.from(new Set(sourceProducts.map((item) => item.category))).sort(
        (left, right) =>
          getLocalizedText(sourceCategoryLabels[left], lang).localeCompare(
            getLocalizedText(sourceCategoryLabels[right], lang),
          ),
      ),
    [lang, sourceProducts],
  );

  const sourceIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...sourceProducts.map((item) => item.source),
          ...womenCatalogCollections.map((collection) => collection.source),
        ]),
      ),
    [sourceProducts],
  );

  const availableBrands = useMemo(() => {
    const categoryFiltered = activeCategory
      ? sourceProducts.filter((item) => item.category === activeCategory)
      : sourceProducts;

    const sourceFiltered = activeSource
      ? categoryFiltered.filter((item) => item.source === activeSource)
      : categoryFiltered;

    return Array.from(new Set(sourceFiltered.map((item) => item.brand))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [activeCategory, activeSource, sourceProducts]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sourceProducts.filter((item) => {
      if (activeCategory && item.category !== activeCategory) {
        return false;
      }

      if (activeBrand && item.brand !== activeBrand) {
        return false;
      }

      if (activeSource && item.source !== activeSource) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const sourceLabel = getLocalizedText(
        catalogSourceLabels[item.source],
        lang,
      ).toLowerCase();
      const categoryLabel = getLocalizedText(
        sourceCategoryLabels[item.category],
        lang,
      ).toLowerCase();

      return [item.name, item.brand, sourceLabel, categoryLabel].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    });
  }, [activeBrand, activeCategory, activeSource, lang, query, sourceProducts]);

  const filteredCollections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return womenCatalogCollections.filter((collection) => {
      if (
        activeSource &&
        collection.source !== activeSource
      ) {
        return false;
      }

      if (activeCategory) {
        if (!getCollectionCategories(collection.section).includes(activeCategory)) {
          return false;
        }
      }

      if (!normalizedQuery) {
        return true;
      }

      const collectionName = getLocalizedText(collection.name, lang).toLowerCase();
      const sourceLabel = getLocalizedText(
        catalogSourceLabels[collection.source],
        lang,
      ).toLowerCase();

      return (
        collectionName.includes(normalizedQuery) ||
        sourceLabel.includes(normalizedQuery)
      );
    });
  }, [activeCategory, activeSource, lang, query]);

  const modestItems = useMemo(
    () => sourceProducts.filter((item) => item.tags.includes("modest")).slice(0, 12),
    [sourceProducts],
  );

  usePageMeta({
    title: t("sourceCatalog.title"),
    description: t("sourceCatalog.description"),
    path: searchParams.toString() ? `/catalog?${searchParams.toString()}` : "/catalog",
  });

  const updateParam = (key: string, value?: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-background px-4 pt-32 pb-20 text-foreground">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gold">
            {t("sourceCatalog.eyebrow")}
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-[0.95] md:text-6xl">
            {t("sourceCatalog.title")}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            {t("sourceCatalog.description")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop">
              <Button variant="gold">{t("sourceCatalog.storefrontCta")}</Button>
            </Link>
            <a href="#modest-edit">
              <Button variant="gold-outline">{t("sourceCatalog.modestTitle")}</Button>
            </a>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">
              {t("sourceCatalog.importedStat")}
            </p>
            <p className="mt-3 font-heading text-4xl">{sourceProducts.length}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">
              {t("sourceCatalog.collectionStat")}
            </p>
            <p className="mt-3 font-heading text-4xl">{womenCatalogCollections.length}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">
              {t("sourceCatalog.modestStat")}
            </p>
            <p className="mt-3 font-heading text-4xl">
              {sourceProducts.filter((item) => item.tags.includes("modest")).length}
            </p>
          </div>
        </div>

        <section id="modest-edit" className="scroll-mt-24 py-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gold">
                {t("sourceCatalog.modestEyebrow")}
              </p>
              <h2 className="mt-4 font-heading text-3xl md:text-4xl">
                {t("sourceCatalog.modestTitle")}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {t("sourceCatalog.modestDescription")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={`modest-skeleton-${index}`}
                    className="h-[420px] animate-pulse rounded-3xl border border-border bg-card"
                  />
                ))
              : modestItems.map((item, index) => (
                  <SourceProductCard key={item.id} item={item} index={index} />
                ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("shop.filters")}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                {t("sourceCatalog.snapshotNote")}
              </p>
            </div>

            <div className="w-full xl:w-[340px]">
              <input
                type="search"
                value={query}
                onChange={(event) => updateParam("q", event.target.value || undefined)}
                placeholder={t("sourceCatalog.searchPlaceholder")}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {t("sourceCatalog.category")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateParam("category")}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                    !activeCategory
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("common.all")}
                </button>
                {categoryIds.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => updateParam("category", category)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                      activeCategory === category
                        ? "border-gold bg-gold text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {getLocalizedText(sourceCategoryLabels[category], lang)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {t("sourceCatalog.brand")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateParam("brand")}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                    !activeBrand
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("common.all")}
                </button>
                {availableBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => updateParam("brand", brand)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                      activeBrand === brand
                        ? "border-gold bg-gold text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {t("sourceCatalog.source")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateParam("source")}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                    !activeSource
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("sourceCatalog.seeAllSources")}
                </button>
                {sourceIds.map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => updateParam("source", source)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                      activeSource === source
                        ? "border-gold bg-gold text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {getLocalizedText(catalogSourceLabels[source], lang)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="catalog-results" className="py-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("sourceCatalog.results", { count: filteredItems.length })}
              </p>
              <h2 className="mt-3 font-heading text-3xl md:text-4xl">
                {t("sourceCatalog.title")}
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={`source-skeleton-${index}`}
                  className="h-[420px] animate-pulse rounded-3xl border border-border bg-card"
                />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
              <h2 className="font-heading text-3xl">{t("shop.noProductsTitle")}</h2>
              <p className="mt-4 text-muted-foreground">
                {isError ? t("common.notFound") : t("sourceCatalog.empty")}
              </p>
              <Button
                variant="gold"
                className="mt-6"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                {t("common.resetFilters")}
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {filteredItems.map((item, index) => (
                <SourceProductCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </section>

        <section className="border-t border-border pt-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("sourceCatalog.collectionEyebrow")}
              </p>
              <h2 className="mt-3 font-heading text-3xl md:text-4xl">
                {t("sourceCatalog.collectionTitle")}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {t("sourceCatalog.collectionDescription")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredCollections.map((collection, index) => (
              <CatalogCollectionCard
                key={collection.id}
                collection={collection}
                index={index}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Catalog;
