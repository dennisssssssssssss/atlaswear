import { useMemo } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

import CatalogImage from "@/components/CatalogImage";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import {
  getCatalogCategoryLabel,
  sortCatalogProducts,
  type CatalogProduct,
} from "@/lib/catalog";

const featuredBrandNames = [
  "Gucci",
  "Prada",
  "Louis Vuitton",
  "Chanel",
  "Dior",
  "Hermes",
  "Celine",
  "Saint Laurent",
];

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

const homepageReviews = [
  {
    name: "Mara Stoian",
    city: "Cluj-Napoca",
    date: "20 februarie 2026",
    rating: 5,
    text:
      "Am comandat o geanta pentru birou si am primit poze inainte sa fie trimisa. Ambalajul a fost curat, iar coletul a ajuns in doua zile.",
  },
  {
    name: "Radu Enache",
    city: "Brasov",
    date: "23 februarie 2026",
    rating: 4,
    text:
      "Am luat o pereche de adidasi si marimea a fost confirmata pe WhatsApp inainte de livrare. Mi-a placut ca nu am platit online, doar ramburs cand a ajuns coletul.",
  },
  {
    name: "Ioana Marinescu",
    city: "Bucuresti",
    date: "5 martie 2026",
    rating: 5,
    text:
      "Rochia arata ca in poze, fara surprize la material sau culoare. Am intrebat de lungime si am primit raspuns rapid, apoi comanda a plecat in aceeasi zi.",
  },
  {
    name: "Alexandru Dobre",
    city: "Timisoara",
    date: "18 martie 2026",
    rating: 5,
    text:
      "Am comandat loafers si am cerut o verificare extra pe talpa. Au venit bine impachetati si am mai facut o comanda dupa doua saptamani.",
  },
  {
    name: "Bianca Neagu",
    city: "Iasi",
    date: "29 martie 2026",
    rating: 4,
    text:
      "Geanta a venit cu ambalajul original si fara urme. Transportul a durat trei zile, exact cum mi s-a spus la confirmare.",
  },
  {
    name: "Sorin Matei",
    city: "Oradea",
    date: "7 aprilie 2026",
    rating: 5,
    text:
      "Am comandat un tricou polo si o sapca. Mi-au confirmat culorile inainte de expediere si totul a ajuns intr-un singur colet.",
  },
  {
    name: "Daria Petrescu",
    city: "Constanta",
    date: "16 aprilie 2026",
    rating: 5,
    text:
      "Am vrut o rochie pentru un eveniment si am primit poze suplimentare cu detaliile. A ajuns la timp, iar ambalajul a fost intact.",
  },
  {
    name: "Elena Grigore",
    city: "Sibiu",
    date: "25 aprilie 2026",
    rating: 4,
    text:
      "Am luat sandale si am apreciat ca mi s-a spus clar cand pleaca pachetul. Marimea a fost buna si am pastrat conversatia pentru urmatoarea comanda.",
  },
];

const getBrandUrl = (brand: string) => `/shop?brand=${encodeURIComponent(brand)}`;

const getHeroProduct = (products: CatalogProduct[]) =>
  products.find(
    (product) =>
      product.featured &&
      product.imageFit === "cover" &&
      ["bags", "dresses", "sneakers", "men-sneakers", "watches"].includes(
        product.category,
      ),
  ) ?? products.find((product) => product.imageFit === "cover") ?? products[0];

const sortNewestFirst = (products: CatalogProduct[]) =>
  [...products].sort((left, right) => right.id.localeCompare(left.id));

const buildFeaturedBrandCards = (products: CatalogProduct[]) =>
  featuredBrandNames
    .map((brand) => {
      const brandProducts = products.filter((product) => product.brand === brand);
      const product =
        brandProducts.find(
          (entry) => entry.featured && entry.imageFit === "cover",
        ) ??
        [...brandProducts].sort(
          (left, right) => (right.photoCount ?? 0) - (left.photoCount ?? 0),
        )[0];

      return product ? { brand, product } : null;
    })
    .filter((entry): entry is { brand: string; product: CatalogProduct } =>
      Boolean(entry),
    );

const Index = () => {
  const { lang, t } = useLanguage();
  const { products, categories, isLoading } = useCatalogProducts();

  usePageMeta({ path: "/" });

  const sortedProducts = useMemo(
    () => sortCatalogProducts(products, "featured"),
    [products],
  );
  const heroProduct = useMemo(() => getHeroProduct(sortedProducts), [sortedProducts]);
  const featuredBrandCards = useMemo(
    () => buildFeaturedBrandCards(products),
    [products],
  );
  const newArrivalProducts = useMemo(
    () => sortNewestFirst(products).slice(0, 4),
    [products],
  );
  const bestSellerProducts = useMemo(
    () =>
      sortedProducts
        .filter((product) => product.featured || product.bestPrice)
        .slice(0, 4),
    [sortedProducts],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section
        className="relative flex min-h-[78vh] overflow-hidden bg-[#070707] bg-cover bg-center px-4 pb-14 pt-32 md:pt-40"
        style={
          heroProduct?.images[0]
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 46%, rgba(0,0,0,0.18) 100%), url(${heroProduct.images[0]})`,
              }
            : undefined
        }
      >
        <div className="container relative flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-xs uppercase tracking-[0.42em] text-gold">
              {t("hero.kicker")}
            </p>
            <h1 className="mt-6 max-w-[12ch] font-heading text-5xl leading-[0.9] text-foreground sm:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
              {t("hero.description")}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/nou">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  {t("New arrivals", "Produse noi")}
                  <ArrowRight size={17} />
                </Button>
              </Link>
              <Link to="/shop">
                <Button
                  variant="gold-outline"
                  size="lg"
                  className="w-full bg-black/40 sm:w-auto"
                >
                  {t("hero.ctaShop")}
                </Button>
              </Link>
            </div>

            {heroProduct ? (
              <Link
                to={`/product/${heroProduct.id}`}
                className="mt-10 inline-flex max-w-full flex-col border-l border-gold pl-4 text-left transition-colors hover:text-gold"
              >
                <span className="text-xs uppercase tracking-[0.28em] text-gold">
                  {heroProduct.brand}
                </span>
                <span className="mt-2 max-w-[28rem] truncate font-heading text-xl text-foreground">
                  {heroProduct.name}
                </span>
              </Link>
            ) : null}
          </motion.div>
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

      <section className="px-4 py-16 md:py-20">
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold">
                {t("Featured brands", "Branduri principale")}
              </p>
              <h2 className="mt-4 font-heading text-4xl">
                {t("Names customers ask for", "Branduri cautate constant")}
              </h2>
            </div>
            <Link
              to="/branduri"
              className="hidden text-sm uppercase tracking-[0.24em] text-gold transition-colors hover:text-gold-light md:inline-flex"
            >
              {t("All brands", "Toate brandurile")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {isLoading
              ? Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={`brand-loading-${index}`}
                    className="aspect-square animate-pulse rounded-lg border border-border bg-card"
                  />
                ))
              : featuredBrandCards.map((card) => (
                  <Link
                    key={card.brand}
                    to={getBrandUrl(card.brand)}
                    className="group block"
                  >
                    <div className="overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 group-hover:border-gold">
                      <div className="aspect-square">
                        <CatalogImage
                          src={card.product.images[0]}
                          alt={card.brand}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                          fallbackLabel={card.brand}
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-center text-xs uppercase tracking-[0.22em] text-gold">
                      {card.brand}
                    </p>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:py-24">
        <div className="container">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold">
                {t("New arrivals", "Produse noi")}
              </p>
              <h2 className="mt-4 font-heading text-4xl">
                {t("Recently added", "Adaugate recent")}
              </h2>
            </div>
            <Link
              to="/nou"
              className="hidden text-sm uppercase tracking-[0.24em] text-gold transition-colors hover:text-gold-light md:inline-flex"
            >
              {t("See all", "Vezi toate")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={`product-loading-${index}`}
                    className="h-[430px] animate-pulse rounded-lg border border-border bg-card"
                  />
                ))
              : newArrivalProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
          </div>
        </div>
      </section>

      <section className="bg-card px-4 py-20 md:py-24">
        <div className="container">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold">
                {t("Best sellers", "Best sellers")}
              </p>
              <h2 className="mt-4 font-heading text-4xl">
                {t("Strong picks right now", "Piese care se cer acum")}
              </h2>
            </div>
            <Link
              to="/shop?sort=featured"
              className="hidden text-sm uppercase tracking-[0.24em] text-gold transition-colors hover:text-gold-light md:inline-flex"
            >
              {t("nav.shop")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={`best-loading-${index}`}
                    className="h-[430px] animate-pulse rounded-lg border border-border bg-background"
                  />
                ))
              : bestSellerProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:py-24">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            {t("home.categoriesEyebrow")}
          </p>
          <h2 className="mt-4 font-heading text-4xl">
            {t("home.categoriesTitle")}
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
                <div className="p-3 sm:p-5">
                  <p className="break-words font-heading text-lg leading-tight sm:text-2xl">
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
        <div className="container">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Recenzii clienti
          </p>
          <h2 className="mt-4 font-heading text-4xl">Ce spun clientii</h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {homepageReviews.map((review) => (
              <article
                key={`${review.name}-${review.date}`}
                className="flex h-full flex-col rounded-lg border border-border bg-card p-5"
              >
                <div className="flex gap-1 text-gold" aria-label={`${review.rating} stele`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={`${review.name}-star-${index}`}
                      size={16}
                      className={
                        index < review.rating
                          ? "fill-gold text-gold"
                          : "text-border"
                      }
                    />
                  ))}
                </div>
                <p className="mt-5 flex-1 text-sm leading-7 text-muted-foreground">
                  {review.text}
                </p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-heading text-lg text-foreground">
                    {review.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {review.city} - {review.date}
                  </p>
                </div>
              </article>
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
              <Button variant="gold">
                <MessageCircle size={16} />
                {t("home.contactCta")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
