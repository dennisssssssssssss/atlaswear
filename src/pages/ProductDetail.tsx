import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import CatalogImage from "@/components/CatalogImage";
import { Button } from "@/components/ui/button";
import { publicTelegramUrl, siteConfig } from "@/config/site";
import {
  getCategoryLabel,
  getLocalizedText,
  getProductCompareAt,
  getProductPrice,
  products,
} from "@/data/products";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  buildProductTelegramLink,
  buildProductWhatsappLink,
} from "@/lib/contact";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((entry) => entry.id === id);
  const { formatPrice } = useCurrency();
  const { lang, t } = useLanguage();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize(product?.sizes[0] ?? "");
    setSelectedColor(product?.colors[0]?.id ?? "");
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

  const telegramLink = useMemo(
    () => (product ? buildProductTelegramLink(product, lang, selectedSize) : ""),
    [lang, product, selectedSize],
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-background px-4 pt-32 pb-20 text-foreground">
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

  const selectedColorLabel = product.colors.find(
    (color) => color.id === selectedColor,
  )?.name;
  const compareAt = getProductCompareAt(product);
  const hasSecondaryChannel = Boolean(publicTelegramUrl);

  return (
    <div className="min-h-screen bg-background px-4 pt-32 pb-20 text-foreground">
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
                  src={product.images[selectedImage]}
                  alt={`${product.brand} ${product.name}`}
                  className={imageClass}
                  fallbackClassName="p-8"
                />
              </div>
            </div>

            {product.images.length > 1 ? (
              <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
                {product.images.map((image, index) => (
                  <button
                    key={image}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="rounded-[2rem] border border-border bg-card p-6 md:p-8"
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-gold">
                {getCategoryLabel(product.category, lang)}
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
            <h1 className="mt-3 font-heading text-4xl leading-tight md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl">{formatPrice(getProductPrice(product))}</span>
              {compareAt ? (
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(compareAt)}
                </span>
              ) : null}
            </div>

            <p className="mt-5 text-sm uppercase tracking-[0.22em] text-gold">
              {t("product.trustLine")}
            </p>

            {product.sizes.length > 0 ? (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {t("product.sizes")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
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

            {product.colors.length > 0 ? (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {t("product.variants")}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={`flex items-center gap-3 rounded-full border px-3 py-2 transition-colors ${
                        selectedColor === color.id
                          ? "border-gold bg-background"
                          : "border-border"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden
                      />
                      <span className="text-sm text-muted-foreground">
                        {getLocalizedText(color.name, lang)}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedColorLabel ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {getLocalizedText(selectedColorLabel, lang)}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 rounded-3xl border border-border bg-background/70 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {t("product.orderTitle")}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t("product.instructions")}
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
      </div>
    </div>
  );
};

export default ProductDetail;
