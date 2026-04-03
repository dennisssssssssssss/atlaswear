import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded aspect-[3/4] bg-surface">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-xs tracking-[0.3em] uppercase text-foreground border border-foreground px-4 py-2 bg-background/50 backdrop-blur-sm">
              {t('Quick View', 'Vezi rapid')}
            </span>
          </div>
          {product.onSale && (
            <span className="absolute top-3 left-3 bg-gold text-primary-foreground text-[10px] tracking-widest uppercase px-3 py-1 font-bold">
              {t('Sale', 'Reducere')}
            </span>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-sm tracking-wider uppercase">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {product.onSale && product.salePrice ? (
              <>
                <span className="text-sm text-gold">{formatPrice(product.salePrice)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.priceUSD)}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">{formatPrice(product.priceUSD)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
