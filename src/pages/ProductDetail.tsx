import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { products } from '@/data/products';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showDescription, setShowDescription] = useState(true);
  const [showShipping, setShowShipping] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">{t('Product not found', 'Produs negăsit')}</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor);
  };

  const price = product.onSale && product.salePrice ? product.salePrice : product.priceUSD;

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="container">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8">
          <ArrowLeft size={16} /> {t('Back to Shop', 'Înapoi la magazin')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded bg-surface">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-gold' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* YouTube embed */}
            {product.youtubeUrl && (
              <div className="aspect-video rounded overflow-hidden">
                <iframe
                  src={product.youtubeUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={product.name}
                />
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2">{product.category}</p>
            <h1 className="font-heading text-3xl md:text-4xl mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-8">
              {product.onSale && product.salePrice ? (
                <>
                  <span className="text-2xl text-gold">{formatPrice(product.salePrice)}</span>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.priceUSD)}</span>
                </>
              ) : (
                <span className="text-2xl text-muted-foreground">{formatPrice(product.priceUSD)}</span>
              )}
            </div>

            {/* Size */}
            <div className="mb-6">
              <h3 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t('Size', 'Mărime')}</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-sm border rounded transition-colors ${selectedSize === s ? 'border-gold text-gold' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-8">
              <h3 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t('Color', 'Culoare')}</h3>
              <div className="flex gap-3">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c.name ? 'border-gold scale-110' : 'border-border'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <Button
              variant="gold"
              size="lg"
              className="w-full text-sm mb-8"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
            >
              {!selectedSize || !selectedColor
                ? t('Select size & color', 'Selectează mărimea și culoarea')
                : t('Add to Cart', 'Adaugă în coș') + ` — ${formatPrice(price)}`}
            </Button>

            {/* Accordions */}
            <div className="border-t border-border">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="w-full flex items-center justify-between py-4 text-sm tracking-wider uppercase"
              >
                {t('Description', 'Descriere')}
                {showDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showDescription && (
                <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{product.description}</p>
              )}
            </div>
            <div className="border-t border-border">
              <button
                onClick={() => setShowShipping(!showShipping)}
                className="w-full flex items-center justify-between py-4 text-sm tracking-wider uppercase"
              >
                {t('Shipping Info', 'Informații livrare')}
                {showShipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showShipping && (
                <div className="text-sm text-muted-foreground pb-4 leading-relaxed space-y-2">
                  <p>{t('🇷🇴 Romania: 2-4 business days', '🇷🇴 România: 2-4 zile lucrătoare')}</p>
                  <p>{t('🇺🇸 USA: 7-14 business days', '🇺🇸 SUA: 7-14 zile lucrătoare')}</p>
                  <p>{t('🌍 International: 10-21 business days', '🌍 Internațional: 10-21 zile lucrătoare')}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
