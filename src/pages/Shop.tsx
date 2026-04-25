import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { motion } from "framer-motion";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  brands,
  categories,
  categoryMap,
  searchProducts,
  type Category,
  products,
} from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { getLocalizedText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const Shop = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") as Category | null;
  const activeBrand = searchParams.get("brand");
  const query = searchParams.get("q") ?? "";

  const currentCategory = activeCategory ? categoryMap.get(activeCategory) : null;
  const currentTitle = currentCategory
    ? getLocalizedText(currentCategory.label, lang)
    : t("shop.title");

  usePageMeta({
    title: currentTitle,
    description: t("shop.description"),
    path: searchParams.toString() ? `/shop?${searchParams.toString()}` : "/shop",
  });

  const availableBrands = useMemo(() => {
    const base = activeCategory
      ? products.filter((product) => product.category === activeCategory)
      : products;

    return Array.from(new Set(base.map((product) => product.brand))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [activeCategory]);

  const filteredProducts = useMemo(() => {
    const categoryFiltered = activeCategory
      ? products.filter((product) => product.category === activeCategory)
      : products;

    const brandFiltered = activeBrand
      ? categoryFiltered.filter((product) => product.brand === activeBrand)
      : categoryFiltered;

    return searchProducts(brandFiltered, query, lang);
  }, [activeBrand, activeCategory, lang, query]);

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
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gold">
            {t("shop.eyebrow")}
          </p>
          <h1 className="mt-4 font-heading text-4xl md:text-6xl">{currentTitle}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            {t("shop.description")}
          </p>
        </motion.div>

        <div className="mt-10 rounded-[2rem] border border-border bg-card p-6">
          <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
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
                    {getLocalizedText(category.label, lang)}
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
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-border bg-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("shop.results", { count: filteredProducts.length })}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {t("shop.sourceCatalogNote")}
              </p>
            </div>

            <Link to="/catalog">
              <Button variant="gold-outline">{t("shop.openSourceCatalog")}</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          {filteredProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
              <h2 className="font-heading text-3xl">{t("shop.noProductsTitle")}</h2>
              <p className="mt-4 text-muted-foreground">
                {t("shop.noProductsDescription")}
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
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
