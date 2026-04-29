import { Link } from "react-router-dom";

import { ShieldCheck, Sparkles, Truck, Wallet } from "lucide-react";
import { motion } from "framer-motion";

import CatalogImage from "@/components/CatalogImage";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { getCatalogCategoryLabel, sortCatalogProducts } from "@/lib/catalog";

const trustItems = [
  {
    icon: ShieldCheck,
    titleKey: "home.trustAuthentic" as const,
    descriptionKey: "home.trustAuthenticDesc" as const,
  },
  {
    icon: Sparkles,
    titleKey: "home.trustSealed" as const,
    descriptionKey: "home.trustSealedDesc" as const,
  },
  {
    icon: Truck,
    titleKey: "home.trustShipping" as const,
    descriptionKey: "home.trustShippingDesc" as const,
  },
  {
    icon: Wallet,
    titleKey: "home.trustPricing" as const,
    descriptionKey: "home.trustPricingDesc" as const,
  },
];

const Index = () => {
  const { lang, t } = useLanguage();
  const { products, categories, isLoading } = useCatalogProducts();

  usePageMeta({ path: "/" });

  const sortedProducts = sortCatalogProducts(products, "featured");
  const featuredProducts = sortedProducts.slice(0, 4);
  const highlightedProducts = sortedProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative flex min-h-[90vh] overflow-hidden bg-[#070707] px-4 pb-16 pt-32 md:pt-40">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(194,162,96,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="container relative flex items-center">
          <div className="grid w-full gap-12 lg:grid-cols-[3fr_2fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-w-0"
            >
              <p className="text-xs uppercase tracking-[0.42em] text-gold">
                {t("hero.kicker")}
              </p>
              <h1 className="mt-6 max-w-[11ch] font-heading text-5xl leading-[0.9] text-foreground sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                {t("hero.description")}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link to="/shop?audience=women">
                  <Button variant="gold" size="lg" className="w-full sm:w-auto">
                    {t("Shop Women", "Shop femei")}
                  </Button>
                </Link>
                <Link to="/shop?audience=men">
                  <Button
                    variant="gold-outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {t("Shop Men", "Shop barbati")}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-1"
            >
              {isLoading
                ? Array.from({ length: 2 }, (_, index) => (
                    <div
                      key={`hero-loading-${index}`}
                      className={`aspect-[3/4] animate-pulse rounded-lg border border-border bg-card ${
                        index === 1 ? "hidden md:block" : ""
                      }`}
                    />
                  ))
                : featuredProducts.slice(0, 2).map((product, index) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className={`group relative overflow-hidden rounded-lg border border-border bg-card transition-transform duration-300 hover:-translate-y-1 ${
                        index === 1 ? "hidden md:block" : ""
                      }`}
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <CatalogImage
                          src={product.images[0]}
                          alt={`${product.brand} ${product.name}`}
                          className={`h-full w-full ${
                            product.imageFit === "contain"
                              ? "object-contain bg-[#f8f5ef] p-6"
                              : "object-cover"
                          }`}
                          loading="lazy"
                          fallbackClassName="p-6"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                        <p className="text-xs uppercase tracking-[0.28em] text-gold">
                          {product.brand}
                        </p>
                      </div>
                    </Link>
                  ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/60 px-4 py-8">
        <div className="container grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.titleKey}
                className="rounded-lg border border-border bg-background/70 p-5"
              >
                <Icon size={18} className="text-gold" />
                <h2 className="mt-4 text-sm uppercase tracking-[0.24em] text-foreground">
                  {t(item.titleKey)}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(item.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-20 md:py-24">
        <div className="container">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold">
                {t("home.newArrivalsEyebrow")}
              </p>
              <h2 className="mt-4 font-heading text-4xl">
                {t("home.newArrivalsTitle")}
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden text-sm uppercase tracking-[0.24em] text-gold transition-colors hover:text-gold-light md:inline-flex"
            >
              {t("nav.shop")}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={`product-loading-${index}`}
                    className="h-[430px] animate-pulse rounded-lg border border-border bg-card"
                  />
                ))
              : highlightedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
          </div>
        </div>
      </section>

      <section className="bg-card px-4 py-20 md:py-24">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            {t("home.categoriesEyebrow")}
          </p>
          <h2 className="mt-4 font-heading text-4xl">
            {t("home.categoriesTitle")}
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group overflow-hidden rounded-lg border border-border bg-background"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <CatalogImage
                    src={category.image}
                    alt={getCatalogCategoryLabel(category.id, lang)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="font-heading text-2xl">
                    {getCatalogCategoryLabel(category.id, lang)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.count} {t("products", "produse")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:py-24">
        <div className="container rounded-lg border border-border bg-card px-6 py-10 md:px-10">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            {t("home.contactTitle")}
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">
              {t("home.contactDescription")}
            </p>
            <Link to="/contact">
              <Button variant="gold">{t("home.contactCta")}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
