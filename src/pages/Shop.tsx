import { useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { products, categories, Category } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion } from 'framer-motion';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const activeCategory = searchParams.get('category') as Category | null;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => p.sizes.forEach(s => sizes.add(s)));
    return Array.from(sizes);
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (activeCategory && p.category !== activeCategory) return false;
      const price = p.onSale && p.salePrice ? p.salePrice : p.priceUSD;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (selectedSize && !p.sizes.includes(selectedSize)) return false;
      return true;
    });
  }, [activeCategory, priceRange, selectedSize]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container">
        {/* Title */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">{t('Browse', 'Răsfoiește')}</p>
          <h1 className="font-heading text-4xl md:text-5xl">
            {activeCategory
              ? categories.find(c => c.id === activeCategory)?.[t('label', 'labelRo') as 'label' | 'labelRo'] || t('Shop', 'Magazin')
              : t('All Products', 'Toate produsele')}
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters */}
          <aside className="lg:w-56 shrink-0 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t('Category', 'Categorie')}</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
                  className={`text-sm text-left transition-colors ${!activeCategory ? 'text-gold' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t('All', 'Toate')}
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { searchParams.set('category', cat.id); setSearchParams(searchParams); }}
                    className={`text-sm text-left transition-colors ${activeCategory === cat.id ? 'text-gold' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t(cat.label, cat.labelRo)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t('Price Range', 'Interval preț')}</h3>
              <input
                type="range"
                min={0}
                max={500}
                value={priceRange[1]}
                onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-gold"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formatPrice(0)} — {formatPrice(priceRange[1])}
              </p>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t('Size', 'Mărime')}</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSize('')}
                  className={`px-3 py-1.5 text-xs border rounded transition-colors ${!selectedSize ? 'border-gold text-gold' : 'border-border text-muted-foreground hover:text-foreground'}`}
                >
                  {t('All', 'Toate')}
                </button>
                {allSizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s === selectedSize ? '' : s)}
                    className={`px-3 py-1.5 text-xs border rounded transition-colors ${selectedSize === s ? 'border-gold text-gold' : 'border-border text-muted-foreground hover:text-foreground'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground text-center py-20">{t('No products found', 'Nu s-au găsit produse')}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
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
