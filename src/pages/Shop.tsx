import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { motion } from "framer-motion";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  type SourceCategory,
  type SourceProductAudience,
} from "@/data/source-products";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import {
  getCatalogCategoryLabel,
  searchCatalogProducts,
  sortCatalogProducts,
  type CatalogSort,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;
const audienceOptions: { id: SourceProductAudience; labelEn: string; labelRo: string }[] = [
  { id: "women", labelEn: "Women", labelRo: "Femei" },
  { id: "men", labelEn: "Men", labelRo: "Barbati" },
  { id: "unisex", labelEn: "Unisex", labelRo: "Unisex" },
];

const Shop = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, isLoading, isError } = useCatalogProducts();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const activeCategory = searchParams.get("category") as SourceCategory | null;
  const activeBrand = searchParams.get("brand");
  const activeAudience = searchParams.get("audience") as SourceProductAudience | null;
  const query = searchParams.get("q") ?? "";
  const activeSort = (searchParams.get("sort") as CatalogSort | null) ?? "featured";

  const currentCategory = categories.find((category) => category.id === activeCategory);
  const currentTitle = currentCategory
    ? getCatalogCategoryLabel(currentCategory.id, lang)
    : t("shop.title");

  usePageMeta({
    title: currentTitle,
    description: t("shop.description"),
    path: searchParams.toString() ? `/shop?${searchParams.toString()}` : "/shop",
  });

  const availableBrands = useMemo(() => {
    const audienceFiltered = activeAudience
      ? products.filter((product) => product.audience === activeAudience)
      : products;
    const base = activeCategory
      ? audienceFiltered.filter((product) => product.category === activeCategory)
      : audienceFiltered;

    return Array.from(new Set(base.map((product) => product.brand))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [activeAudience, activeCategory, products]);

  const filteredProducts = useMemo(() => {
    const audienceFiltered = activeAudience
      ? products.filter((product) => product.audience === activeAudience)
      : products;
    const categoryFiltered = activeCategory
      ? audienceFiltered.filter((product) => product.category === activeCategory)
      : audienceFiltered;

    const brandFiltered = activeBrand
      ? categoryFiltered.filter((product) => product.brand === activeBrand)
      : categoryFiltered;

    return sortCatalogProducts(
      searchCatalogProducts(brandFiltered, query, lang),
      activeSort,
    );
  }, [activeAudience, activeBrand, activeCategory, activeSort, lang, products, query]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeAudience, activeBrand, activeCategory, activeSort, query]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = filteredProducts.length > visibleCount;

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
    <div className="min-h-screen bg-background px-4 pb-20 pt-32 text-foreground">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gold">
            {t("shop.eyebrow")}
          </p>
          <h1 className="mt-4 max-w-[12ch] font-heading text-4xl leading-[0.95] md:text-6xl">
            {currentTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            {t("shop.description")}
          </p>
        </motion.div>

        <div className="mt-10 rounded-[2rem] border border-border bg-card p-6">
          <div className="grid gap-8 xl:grid-cols-[0.85fr_1fr_1fr_260px]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("Audience", "Public")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateParam("audience")}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                    !activeAudience
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("common.all")}
                </button>
                {audienceOptions.map((audience) => (
                  <button
                    key={audience.id}
                    type="button"
                    onClick={() => updateParam("audience", audience.id)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                      activeAudience === audience.id
                        ? "border-gold bg-gold text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t(audience.labelEn, audience.labelRo)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("shop.category")}
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
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => updateParam("category", category.id)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                      activeCategory === category.id
                        ? "border-gold bg-gold text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {getCatalogCategoryLabel(category.id, lang)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("shop.brand")}
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
                    onClick={() =>
                      updateParam("brand", activeBrand === brand ? undefined : brand)
                    }
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
              <label
                htmlFor="catalog-sort"
                className="text-xs uppercase tracking-[0.28em] text-gold"
              >
                {t("Sort by", "Sorteaza dupa")}
              </label>
              <select
                id="catalog-sort"
                value={activeSort}
                onChange={(event) => updateParam("sort", event.target.value)}
                className="mt-4 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-gold"
              >
                <option value="featured">
                  {t("Recommended", "Recomandate")}
                </option>
                <option value="price-asc">
                  {t("Price: low to high", "Pret: crescator")}
                </option>
                <option value="price-desc">
                  {t("Price: high to low", "Pret: descrescator")}
                </option>
                <option value="brand-asc">
                  {t("Brand: A to Z", "Brand: A-Z")}
                </option>
                <option value="name-asc">
                  {t("Name: A to Z", "Nume: A-Z")}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-border bg-card p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("shop.results", { count: filteredProducts.length })}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {t(
                  "All products are listed directly in the storefront, organized by audience, category, and brand.",
                  "Toate produsele sunt listate direct in storefront, organizate pe public, categorii si branduri.",
                )}
              </p>
            </div>
            <Button
              variant="gold-outline"
              onClick={() => setSearchParams(new URLSearchParams())}
            >
              {t("common.resetFilters")}
            </Button>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={`catalog-loading-${index}`}
                  className="h-[430px] animate-pulse rounded-3xl border border-border bg-card"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
              <h2 className="font-heading text-3xl">{t("errorBoundary.title")}</h2>
              <p className="mt-4 text-muted-foreground">{t("errorBoundary.description")}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
              <h2 className="font-heading text-3xl">{t("shop.noProductsTitle")}</h2>
              <p className="mt-4 text-muted-foreground">
                {t("shop.noProductsDescription")}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {visibleProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {hasMoreProducts ? (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="gold"
                    onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
                  >
                    {t("Load more products", "Vezi mai multe produse")}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
