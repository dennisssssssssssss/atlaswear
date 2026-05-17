import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

import CatalogCategoryStrip from "@/components/CatalogCategoryStrip";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  type SourceCategory,
  type SourceProductAudience,
} from "@/data/source-products";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import {
  filterCatalogProductsByNavigation,
  getCatalogUmbrellaLabel,
  normalizeCatalogUmbrella,
} from "@/lib/catalog-filters";
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
const sortOptions: { id: CatalogSort; labelEn: string; labelRo: string }[] = [
  { id: "featured", labelEn: "Recommended", labelRo: "Recomandate" },
  { id: "price-asc", labelEn: "Price: low to high", labelRo: "Pret: crescator" },
  { id: "price-desc", labelEn: "Price: high to low", labelRo: "Pret: descrescator" },
  { id: "brand-asc", labelEn: "Brand: A to Z", labelRo: "Brand: A-Z" },
  { id: "name-asc", labelEn: "Name: A to Z", labelRo: "Nume: A-Z" },
];

const parsePriceParam = (value: string | null) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const sizeSort = (left: string, right: string) =>
  left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base",
  });

const getProductSizeValues = (product: { sizes: string[]; sizeLabel: string }) => {
  if (product.sizes.length > 0) {
    return product.sizes;
  }

  return product.sizeLabel
    .split(/[,/| ]+/)
    .map((size) => size.trim())
    .filter((size) => size.length > 0 && size.length <= 8);
};

const Shop = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, isLoading, isError } = useCatalogProducts();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCategory = searchParams.get("category") as SourceCategory | null;
  const activeUmbrella = normalizeCatalogUmbrella(searchParams.get("umbrella"));
  const activeBrand = searchParams.get("brand");
  const activeAudience = searchParams.get("audience") as SourceProductAudience | null;
  const activeSize = searchParams.get("size");
  const minPriceValue = searchParams.get("minPrice") ?? "";
  const maxPriceValue = searchParams.get("maxPrice") ?? "";
  const activeMinPrice = parsePriceParam(minPriceValue);
  const activeMaxPrice = parsePriceParam(maxPriceValue);
  const query = searchParams.get("q") ?? "";
  const activeSort = (searchParams.get("sort") as CatalogSort | null) ?? "featured";

  const currentCategory = categories.find((category) => category.id === activeCategory);
  const currentTitle = currentCategory
    ? getCatalogCategoryLabel(currentCategory.id, lang)
    : activeUmbrella
      ? getCatalogUmbrellaLabel(activeUmbrella, lang)
    : t("shop.title");

  usePageMeta({
    title: currentTitle,
    description: t("shop.description"),
    path: searchParams.toString() ? `/shop?${searchParams.toString()}` : "/shop",
  });

  const availableBrands = useMemo(() => {
    const base = filterCatalogProductsByNavigation(
      products,
      activeAudience,
      activeCategory,
      activeUmbrella,
    );

    return Array.from(new Set(base.map((product) => product.brand))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [activeAudience, activeCategory, activeUmbrella, products]);

  const availableSizes = useMemo(() => {
    const navigationFiltered = filterCatalogProductsByNavigation(
      products,
      activeAudience,
      activeCategory,
      activeUmbrella,
    );
    const brandFiltered = activeBrand
      ? navigationFiltered.filter((product) => product.brand === activeBrand)
      : navigationFiltered;

    return Array.from(
      new Set(brandFiltered.flatMap((product) => getProductSizeValues(product))),
    ).sort(sizeSort);
  }, [activeAudience, activeBrand, activeCategory, activeUmbrella, products]);

  const filteredProducts = useMemo(() => {
    const navigationFiltered = filterCatalogProductsByNavigation(
      products,
      activeAudience,
      activeCategory,
      activeUmbrella,
    );
    const brandFiltered = activeBrand
      ? navigationFiltered.filter((product) => product.brand === activeBrand)
      : navigationFiltered;
    const sizeFiltered = activeSize
      ? brandFiltered.filter((product) =>
          getProductSizeValues(product).includes(activeSize),
        )
      : brandFiltered;
    const priceFiltered = sizeFiltered.filter((product) => {
      if (activeMinPrice !== null && product.priceRon < activeMinPrice) {
        return false;
      }

      if (activeMaxPrice !== null && product.priceRon > activeMaxPrice) {
        return false;
      }

      return true;
    });

    return sortCatalogProducts(
      searchCatalogProducts(priceFiltered, query, lang),
      activeSort,
    );
  }, [
    activeAudience,
    activeBrand,
    activeCategory,
    activeMaxPrice,
    activeMinPrice,
    activeSize,
    activeSort,
    activeUmbrella,
    lang,
    products,
    query,
  ]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    activeAudience,
    activeBrand,
    activeCategory,
    activeMaxPrice,
    activeMinPrice,
    activeSize,
    activeSort,
    activeUmbrella,
    query,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = filteredProducts.length > visibleCount;
  const activeFilterCount = [
    activeAudience,
    activeBrand,
    activeCategory,
    activeUmbrella,
    activeSize,
    activeMinPrice !== null ? minPriceValue : null,
    activeMaxPrice !== null ? maxPriceValue : null,
    query.trim() ? query : null,
    activeSort !== "featured" ? activeSort : null,
  ].filter(Boolean).length;

  const updateParam = (key: string, value?: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value?.trim()) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    if (key === "audience" || key === "category" || key === "umbrella") {
      nextParams.delete("brand");
      nextParams.delete("size");
    }

    if (key === "category") {
      nextParams.delete("umbrella");
    }

    setSearchParams(nextParams);
  };

  const filterLabelClass = "text-xs uppercase tracking-[0.22em] text-gold";
  const filterControlClass =
    "mt-2 h-12 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-gold";

  const renderFilterControls = (idPrefix: string) => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div>
        <label htmlFor={`${idPrefix}-search`} className={filterLabelClass}>
          {t("Search", "Cauta")}
        </label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={`${idPrefix}-search`}
            value={query}
            onChange={(event) => updateParam("q", event.target.value)}
            placeholder={t("Product or brand", "Produs sau brand")}
            className="h-12 rounded-md border-border bg-background pl-11 pr-11 text-sm focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-0"
          />
          {query ? (
            <button
              type="button"
              onClick={() => updateParam("q")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={t("Clear search", "Sterge cautarea")}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-audience`} className={filterLabelClass}>
          {t("Audience", "Public")}
        </label>
        <select
          id={`${idPrefix}-audience`}
          value={activeAudience ?? ""}
          onChange={(event) =>
            updateParam("audience", event.target.value || undefined)
          }
          className={filterControlClass}
        >
          <option value="">{t("common.all")}</option>
          {audienceOptions.map((audience) => (
            <option key={audience.id} value={audience.id}>
              {t(audience.labelEn, audience.labelRo)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-category`} className={filterLabelClass}>
          {t("shop.category")}
        </label>
        <select
          id={`${idPrefix}-category`}
          value={activeCategory ?? ""}
          onChange={(event) =>
            updateParam("category", event.target.value || undefined)
          }
          className={filterControlClass}
        >
          <option value="">{t("All categories", "Toate categoriile")}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {getCatalogCategoryLabel(category.id, lang)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-brand`} className={filterLabelClass}>
          {t("shop.brand")}
        </label>
        <select
          id={`${idPrefix}-brand`}
          value={activeBrand ?? ""}
          onChange={(event) => updateParam("brand", event.target.value || undefined)}
          className={cn(filterControlClass, "disabled:opacity-60")}
          disabled={availableBrands.length === 0}
        >
          <option value="">{t("All brands", "Toate brandurile")}</option>
          {availableBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-size`} className={filterLabelClass}>
          {t("Size", "Marime")}
        </label>
        <select
          id={`${idPrefix}-size`}
          value={activeSize ?? ""}
          onChange={(event) => updateParam("size", event.target.value || undefined)}
          className={cn(filterControlClass, "disabled:opacity-60")}
          disabled={availableSizes.length === 0}
        >
          <option value="">{t("All sizes", "Toate marimile")}</option>
          {availableSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-min-price`} className={filterLabelClass}>
          {t("Min price", "Pret minim")}
        </label>
        <Input
          id={`${idPrefix}-min-price`}
          type="number"
          inputMode="numeric"
          min={0}
          step={10}
          value={minPriceValue}
          onChange={(event) => updateParam("minPrice", event.target.value)}
          placeholder="0"
          className="mt-2 h-12 rounded-md border-border bg-background px-4 text-sm focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-0"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-max-price`} className={filterLabelClass}>
          {t("Max price", "Pret maxim")}
        </label>
        <Input
          id={`${idPrefix}-max-price`}
          type="number"
          inputMode="numeric"
          min={0}
          step={10}
          value={maxPriceValue}
          onChange={(event) => updateParam("maxPrice", event.target.value)}
          placeholder="999"
          className="mt-2 h-12 rounded-md border-border bg-background px-4 text-sm focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-0"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-sort`} className={filterLabelClass}>
          {t("Sort by", "Sorteaza dupa")}
        </label>
        <select
          id={`${idPrefix}-sort`}
          value={activeSort}
          onChange={(event) => updateParam("sort", event.target.value)}
          className={filterControlClass}
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {t(option.labelEn, option.labelRo)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-64 text-foreground lg:pt-48">
      <CatalogCategoryStrip />
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

        <div className="mt-10 hidden rounded-lg border border-border bg-card p-5 lg:block">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("shop.results", { count: filteredProducts.length })}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t(
                  "Filter fast by product, audience, category or brand.",
                  "Filtreaza rapid dupa produs, public, categorie sau brand.",
                )}
              </p>
            </div>
            {activeFilterCount > 0 ? (
              <Button
                variant="gold-outline"
                onClick={() => setSearchParams(new URLSearchParams())}
                className="min-h-11 shrink-0"
              >
                {t("common.resetFilters")}
              </Button>
            ) : null}
          </div>
          <div className="mt-5">{renderFilterControls("catalog")}</div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-4 lg:hidden">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("shop.results", { count: filteredProducts.length })}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {t(
                  "Use filters only if you want to narrow the catalog fast.",
                  "Foloseste filtrele doar daca vrei sa restrangi catalogul rapid.",
                )}
              </p>
            </div>
            {activeFilterCount > 0 ? (
              <Button
                variant="gold-outline"
                onClick={() => setSearchParams(new URLSearchParams())}
                className="min-h-11"
              >
                {t("common.resetFilters")}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={`catalog-loading-${index}`}
                  className="h-[430px] animate-pulse rounded-lg border border-border bg-card"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <h2 className="font-heading text-3xl">{t("errorBoundary.title")}</h2>
              <p className="mt-4 text-muted-foreground">{t("errorBoundary.description")}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <h2 className="font-heading text-3xl">{t("shop.noProductsTitle")}</h2>
              <p className="mt-4 text-muted-foreground">
                {t("shop.noProductsDescription")}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 xl:grid-cols-4">
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

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetTrigger asChild>
          <Button
            variant="gold"
            className="fixed inset-x-4 bottom-4 z-40 min-h-11 rounded-full text-xs uppercase tracking-widest shadow-2xl lg:hidden"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {activeFilterCount > 0
              ? `${t("Filters", "Filtre")} (${activeFilterCount})`
              : t("Filters", "Filtre")}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-lg border-border bg-card pb-8 lg:hidden"
        >
          <SheetHeader className="pr-10 text-left">
            <SheetTitle className="font-heading text-3xl">
              {t("Filters", "Filtre")}
            </SheetTitle>
            <SheetDescription>
              {t(
                "Choose only what matters and keep browsing.",
                "Alege doar ce conteaza si continua cautarea.",
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">{renderFilterControls("mobile")}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Shop;
