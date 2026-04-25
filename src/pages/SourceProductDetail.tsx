import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft, Images } from "lucide-react";
import { motion } from "framer-motion";

import CatalogImage from "@/components/CatalogImage";
import { Button } from "@/components/ui/button";
import { publicTelegramUrl, siteConfig } from "@/config/site";
import { sourceCategoryLabels } from "@/data/source-products";
import { catalogSourceLabels } from "@/data/women-catalog";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSourceProducts } from "@/hooks/use-source-products";
import {
  buildSourceProductTelegramLink,
  buildSourceProductWhatsappLink,
} from "@/lib/contact";
import { getLocalizedText } from "@/lib/i18n";

const SourceProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sourceProducts = [], isLoading } = useSourceProducts();
  const { lang, t } = useLanguage();

  const product = sourceProducts.find((entry) => entry.id === id);

  usePageMeta({
    title: product ? `${product.brand} ${product.name}` : t("sourceCatalog.itemNotFoundTitle"),
    description: product
      ? t("sourceCatalog.itemMetaDescription", {
          brand: product.brand,
          name: product.name,
          source: getLocalizedText(catalogSourceLabels[product.source], lang),
        })
      : siteConfig.defaultDescription,
    path: product ? `/catalog/item/${product.id}` : "/catalog",
    image: product?.image,
    noindex: !product,
  });

  const preferredSize = product?.sizes[0] ?? product?.sizeLabel ?? "";
  const whatsappLink = useMemo(
    () =>
      product
        ? buildSourceProductWhatsappLink(product, lang, preferredSize)
        : "",
    [lang, preferredSize, product],
  );

  const telegramLink = useMemo(
    () =>
      product
        ? buildSourceProductTelegramLink(product, lang, preferredSize)
        : "",
    [lang, preferredSize, product],
  );

  const hasSecondaryChannel = Boolean(publicTelegramUrl);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 pb-20 pt-32 text-foreground">
        <div className="container">
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
          <h1 className="mt-4 font-heading text-4xl">
            {t("sourceCatalog.itemNotFoundTitle")}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t("sourceCatalog.itemNotFoundDescription")}
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

  const sourceLabel = getLocalizedText(catalogSourceLabels[product.source], lang);
  const categoryLabel = getLocalizedText(sourceCategoryLabels[product.category], lang);
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
            className="space-y-4"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
              <div className="aspect-[4/5] overflow-hidden bg-[#f8f5ef]">
                <CatalogImage
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  className="h-full w-full object-contain p-6"
                  fallbackClassName="p-6"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Images size={16} className="text-gold" />
                <span>
                  {product.photoCount === 1
                    ? t("sourceCatalog.photoCountSingle", { count: 1 })
                    : t("sourceCatalog.photoCount", {
                        count: product.photoCount ?? 0,
                      })}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t("sourceCatalog.localOnlyNote")}
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
                {sourceLabel}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground">
                {categoryLabel}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground">
                {t("common.authenticSealed")}
              </span>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {product.brand}
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl">{t("sourceCatalog.priceOnRequest")}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-gold">
              {t("common.authenticNewPackaging")}
            </p>

            <p className="mt-6 text-base leading-8 text-muted-foreground">
              {t("sourceCatalog.itemDetailDescription", { source: sourceLabel })}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-gold">
                  {t("sourceCatalog.sourceCollectionLabel")}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {getLocalizedText(product.sourceCollection, lang)}
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-gold">
                  {t("sourceCatalog.originalTitle")}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {product.originalTitle}
                </p>
              </div>
            </div>

            {sizeTokens.length > 0 ? (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {t("sourceCatalog.size")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizeTokens.map((size) => (
                    <span
                      key={`${product.id}-${size}`}
                      className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 rounded-3xl border border-border bg-background/70 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {t("product.orderTitle")}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t("common.contactToOrder")}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLink || "/contact"}
                  target={whatsappLink ? "_blank" : undefined}
                  rel={whatsappLink ? "noreferrer" : undefined}
                  className="sm:flex-1"
                >
                  <Button variant="gold" className="w-full">
                    {t("product.orderCtaWhatsApp")}
                  </Button>
                </a>

                <a
                  href={telegramLink || "/contact"}
                  target={telegramLink ? "_blank" : undefined}
                  rel={telegramLink ? "noreferrer" : undefined}
                  className="sm:flex-1"
                >
                  <Button
                    variant={hasSecondaryChannel ? "gold-outline" : "outline"}
                    className="w-full"
                  >
                    {hasSecondaryChannel
                      ? t("product.orderCtaTelegram")
                      : t("product.orderCtaFallback")}
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SourceProductDetail;
