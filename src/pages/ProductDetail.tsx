import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import {
  categories,
  getLocalizedText,
  getProductPrice,
  products,
} from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageMeta } from '@/hooks/use-page-meta';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((item) => item.id === id);
  const { formatPrice } = useCurrency();
  const { lang, t } = useLanguage();
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showDescription, setShowDescription] = useState(true);
  const [showShipping, setShowShipping] = useState(false);

  usePageMeta({
    title: product ? getLocalizedText(product.name, lang) : 'Product',
    description: product
      ? getLocalizedText(product.description, lang)
      : siteConfig.defaultDescription,
    path: product ? `/product/${product.id}` : '/shop',
    image: product?.images[0],
  });

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">
          {t('Product not found', 'Produs negasit')}
        </p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      return;
    }

    addItem(product, selectedSize, selectedColor);
  };

  const price = getProductPrice(product);
  const productName = getLocalizedText(product.name, lang);
  const productDescription = getLocalizedText(product.description, lang);
  const categoryLabel =
    categories.find((entry) => entry.id === product.category)?.label ?? product.category;
  const selectedColorLabel =
    product.colors.find((color) => color.id === selectedColor)?.name ?? '';
  const mainImageClass =
    product.imageFit === 'contain'
      ? 'w-full h-full object-contain bg-[#f8f5ef] p-6'
      : 'w-full h-full object-cover';
  const thumbImageClass =
    product.imageFit === 'contain'
      ? 'w-full h-full object-contain bg-[#f8f5ef] p-1'
      : 'w-full h-full object-cover';

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="container">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={16} /> {t('Back to Shop', 'Inapoi la magazin')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="aspect-[3/4] overflow-hidden rounded bg-surface">
              <img
                src={product.images[selectedImage]}
                alt={productName}
                className={mainImageClass}
              />
            </div>

            {product.images.length > 1 ? (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className={thumbImageClass}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            {product.youtubeUrl ? (
              <div className="aspect-video rounded overflow-hidden">
                <iframe
                  src={product.youtubeUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={productName}
                />
              </div>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2">
              {getLocalizedText(categoryLabel, lang)}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl mb-4">
              {productName}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              {product.onSale && product.salePrice ? (
                <>
                  <span className="text-2xl text-gold">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.priceUSD)}
                  </span>
                </>
              ) : (
                <span className="text-2xl text-muted-foreground">
                  {formatPrice(price)}
                </span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
                {t('Size', 'Marime')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border rounded transition-colors ${
                      selectedSize === size
                        ? 'border-gold text-gold'
                        : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
                {t('Color', 'Culoare')}
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.id
                        ? 'border-gold scale-110'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={getLocalizedText(color.name, lang)}
                  />
                ))}
              </div>
              {selectedColorLabel ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {getLocalizedText(selectedColorLabel, lang)}
                </p>
              ) : null}
            </div>

            <Button
              variant="gold"
              size="lg"
              className="w-full text-sm mb-8"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
            >
              {!selectedSize || !selectedColor
                ? t('Select size & color', 'Selecteaza marimea si culoarea')
                : `${t('Add to Cart', 'Adauga in cos')} - ${formatPrice(price)}`}
            </Button>

            <div className="border-t border-border">
              <button
                onClick={() => setShowDescription((current) => !current)}
                className="w-full flex items-center justify-between py-4 text-sm tracking-wider uppercase"
              >
                {t('Description', 'Descriere')}
                {showDescription ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {showDescription ? (
                <div className="pb-4 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {productDescription}
                  </p>
                  {product.details.length > 0 ? (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {product.details.map((detail) => (
                        <li key={detail.en} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                          <span>{getLocalizedText(detail, lang)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="border-t border-border">
              <button
                onClick={() => setShowShipping((current) => !current)}
                className="w-full flex items-center justify-between py-4 text-sm tracking-wider uppercase"
              >
                {t('Shipping Info', 'Informatii livrare')}
                {showShipping ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {showShipping ? (
                <div className="text-sm text-muted-foreground pb-4 leading-relaxed space-y-2">
                  <p>
                    {t('Romania:', 'Romania:')}{' '}
                    {siteConfig.shipping.romaniaWindow}
                  </p>
                  <p>
                    {t('International:', 'International:')}{' '}
                    {siteConfig.shipping.internationalWindow}
                  </p>
                  <p>{siteConfig.shipping.dutiesNote}</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
