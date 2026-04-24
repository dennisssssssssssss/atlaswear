import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { motion } from 'framer-motion';

import ProductCard from '@/components/ProductCard';
import {
  categories,
  Category,
  getLocalizedText,
  getProductPrice,
  products,
} from '@/data/products';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageMeta } from '@/hooks/use-page-meta';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const activeCategory = searchParams.get('category') as Category | null;
  const maxProductPrice = useMemo(
    () => Math.max(...products.map((product) => getProductPrice(product))),
    [],
  );
  const priceSliderMax = useMemo(
    () => Math.max(500, Math.ceil(maxProductPrice / 50) * 50),
    [maxProductPrice],
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(() => [
    0,
    priceSliderMax,
  ]);
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    setPriceRange([0, priceSliderMax]);
  }, [priceSliderMax]);

  const currentCategory = activeCategory
    ? categories.find((category) => category.id === activeCategory)
    : undefined;
  const currentCategoryName = currentCategory
    ? getLocalizedText(currentCategory.label, lang)
    : t('All Products', 'Toate produsele');

  usePageMeta({
    title: currentCategory
      ? getLocalizedText(currentCategory.label, lang)
      : 'Shop',
    description: t(
      'Browse the ATLAS women catalog of dresses, shoes, bags, and premium separates.',
      'Rasfoieste catalogul ATLAS pentru femei cu rochii, pantofi, posete si piese premium.',
    ),
    path: activeCategory ? `/shop?category=${activeCategory}` : '/shop',
  });

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((product) =>
      product.sizes.forEach((size) => sizes.add(size)),
    );
    return Array.from(sizes);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeCategory && product.category !== activeCategory) {
        return false;
      }

      const price = getProductPrice(product);

      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      if (selectedSize && !product.sizes.includes(selectedSize)) {
        return false;
      }

      return true;
    });
  }, [activeCategory, priceRange, selectedSize]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
            {t('Browse', 'Rasfoieste')}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl">
            {currentCategoryName}
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-56 shrink-0 space-y-8">
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
                {t('Category', 'Categorie')}
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    searchParams.delete('category');
                    setSearchParams(searchParams);
                  }}
                  className={`text-sm text-left transition-colors ${
                    !activeCategory
                      ? 'text-gold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('All', 'Toate')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      searchParams.set('category', category.id);
                      setSearchParams(searchParams);
                    }}
                    className={`text-sm text-left transition-colors ${
                      activeCategory === category.id
                        ? 'text-gold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {getLocalizedText(category.label, lang)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
                {t('Price Range', 'Interval pret')}
              </h3>
              <input
                type="range"
                min={0}
                max={priceSliderMax}
                value={priceRange[1]}
                onChange={(event) =>
                  setPriceRange([0, parseInt(event.target.value, 10)])
                }
                className="w-full accent-gold"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formatPrice(0)} - {formatPrice(priceRange[1])}
              </p>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
                {t('Size', 'Marime')}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSize('')}
                  className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                    !selectedSize
                      ? 'border-gold text-gold'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('All', 'Toate')}
                </button>
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(size === selectedSize ? '' : size)
                    }
                    className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                      selectedSize === size
                        ? 'border-gold text-gold'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-20">
                {t('No products found', 'Nu s-au gasit produse')}
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
