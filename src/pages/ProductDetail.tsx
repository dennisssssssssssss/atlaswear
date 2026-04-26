import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import CatalogImage from "@/components/CatalogImage";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { getCatalogCategoryLabel } from "@/lib/catalog";
import { buildProductWhatsappLink } from "@/lib/contact";
import { getLocalizedText } from "@/lib/i18n";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { productMap, isLoading } = useCatalogProducts();
  const product = id ? productMap.get(id) : undefined;
  const { formatPrice } = useCurrency();
  const { lang, t } = useLanguage();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize(product?.sizes[0] ?? "");
  }, [product]);

  usePageMeta({
    title: product ? `${product.brand} ${product.name}` : t("product.notFoundTitle"),
    description: product
      ? getLocalizedText(product.description, lang)
      : siteConfig.defaultDescription,
    path: product ? `/product/${product.id}` : "/shop",
    image: product?.images[0],
    noindex: !product,
  });

  const whatsappLink = useMemo(
    () => (product ? buildProductWhatsappLink(product, lang, selectedSize) : ""),
    [lang, product, selectedSize],
  );

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.relatedProductIds
      .map((relatedId) => productMap.get(relatedId))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .slice(0, 4);
  }, [product, productMap]);

  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }

    return Array.from(
      new Set([product.images[0], ...relatedProducts.map((item) => item.images[0])]),
    ).filter(Boolean);
  }, [product, relatedProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 pb-20 pt-32 text-foreground">
        <div className="container grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="h-[560px] animate-pulse rounded-[2rem] border border-border bg-card" />
          <div className="h-[560px] animate-pulse rounded-[2rem] border border-border bg-card" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background px-4 pb-20 pt-32 text-foreground">
        <div className="container max-w-2xl rounded-[2rem] border border-border bg-card p-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">ATLAS</p>
          <h1 className="mt-4 font-heading text-4xl">{t("product.notFoundTitle")}</h1>
          <p className="mt-4 text-muted-foreground">
            {t("product.notFoundDescription")}
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex text-sm uppercase tracking-[0.22em] text-gold transition-colors hover:text-gold-light"
          >
            {t("common.backToShop")}
          </Link>
        </div>
      </div>
    );
  }

  const imageClass =
    product.imageFit === "contain"
      ? "h-full w-full object-contain bg-[#f8f5ef] p-8"
      : "h-full w-full object-cover";

  const sizeTokens =
    product.sizes.length > 0
      ? product.sizes
      : product.sizeLabel
          .split(/[,/]/)
          .map((size) => size.trim())
          .filter(Boolean);

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-32 text-foreground">
      <div className="container">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} />
          {t("common.backToShop")}
        </Link>

        <div className="mt-8 grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
              <div className="aspect-[4/5] overflow-hidden">
                <CatalogImage
                  src={galleryImages[selectedImage] ?? product.images[0]}
                  alt={`${product.brand} ${product.name}`}
                  className={imageClass}
                  fallbackClassName="p-8"
                />
              </div>
            </div>

            {galleryImages.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${product.id}-gallery-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-2xl border ${
                      selectedImage === index ? "border-gold" : "border-border"
                    }`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <CatalogImage
                        src={image}
                        alt=""
                        className={`h-full w-full ${
                          product.imageFit === "contain"
                            ? "object-contain bg-[#f8f5ef] p-2"
                            : "object-cover"
                        }`}
                        loading="lazy"
                        fallbackClassName="p-2"
                      />
                    </div>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {t("Product gallery", "Galerie produs")}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {product.photoCount
                  ? lang === "ro"
                    ? `${product.photoCount} poze disponibile pentru verificare inainte de comanda.`
                    : `${product.photoCount} photos available to review before ordering.`
                  : t(
                      "Additional photos can be confirmed directly before ordering.",
                      "Pozele suplimentare se pot confirma direct inainte de comanda.",
                    )}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t(
                  "Extra visuals from the same line are kept inside the site so browsing stays clean.",
                  "Vizualurile extra din aceeasi linie sunt pastrate in site pentru o navigare curata.",
                )}
              </p>
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
                {getCatalogCategoryLabel(product.category, lang)}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground">
                {t("common.authenticSealed")}
              </span>
              {product.bestPrice ? (
                <span className="rounded-full bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-primary-foreground">
                  {t("common.bestPrice")}
                </span>
              ) : null}
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {product.brand}
            </p>
            <h1 className="mt-3 max-w-[14ch] font-heading text-4xl leading-tight md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl">{formatPrice(product.priceRon)}</span>
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.compareAtRon)}
              </span>
            </div>

            <p className="mt-5 text-sm uppercase tracking-[0.22em] text-gold">
              {t("product.trustLine")}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-gold">
                  {t("Collection", "Colectie")}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {getLocalizedText(product.sourceCollection, lang)}
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-gold">
                  {t("Availability", "Disponibilitate")}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(
                    "Availability and final size confirmation are handled directly before order placement.",
                    "Disponibilitatea si confirmarea finala de marime se fac direct inainte de plasarea comenzii.",
                  )}
                </p>
              </div>
            </div>

            {sizeTokens.length > 0 ? (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {t("product.sizes")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizeTokens.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        selectedSize === size
                          ? "border-gold bg-gold text-primary-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 rounded-3xl border border-border bg-background/70 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {t("product.orderTitle")}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t("product.instructions")}
              </p>

              <div className="mt-5">
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <Button
                      variant="gold"
                      className="w-full whitespace-normal text-center leading-5"
                    >
                      {t("product.orderCtaWhatsApp")}
                    </Button>
                  </a>
                ) : (
                  <Link to="/contact" className="block">
                    <Button
                      variant="gold"
                      className="w-full whitespace-normal text-center leading-5"
                    >
                      {t("product.orderCtaFallback")}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <h2 className="font-heading text-2xl">{t("product.description")}</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                {getLocalizedText(product.description, lang)}
              </p>

              {product.details.length > 0 ? (
                <ul className="mt-6 space-y-3 text-sm leading-7 text-muted-foreground">
                  {product.details.map((detail) => (
                    <li key={detail.en} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>{getLocalizedText(detail, lang)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mt-16">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-gold">
                  {t("More from this line", "Mai mult din aceasta colectie")}
                </p>
                <h2 className="mt-3 font-heading text-3xl md:text-4xl">
                  {getLocalizedText(product.sourceCollection, lang)}
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {t(
                  "Browse more pieces from the same line directly on the site.",
                  "Vezi mai multe piese din aceeasi linie direct pe site.",
                )}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetail;
