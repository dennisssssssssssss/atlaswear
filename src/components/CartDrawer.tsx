import { Link } from 'react-router-dom';

import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  getLocalizedText,
  getProductColorLabel,
  getProductPrice,
} from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';

const CartDrawer = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalUSD,
    isOpen,
    setIsOpen,
  } = useCart();
  const { formatPrice } = useCurrency();
  const { lang, t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-heading text-lg flex items-center gap-2">
                <ShoppingBag size={18} className="text-gold" />
                {t('Your Cart', 'Cosul tau')} ({totalItems})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {t('Your cart is empty', 'Cosul tau este gol')}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => {
                    const price = getProductPrice(item.product);
                    const productName = getLocalizedText(item.product.name, lang);
                    const colorLabel = getProductColorLabel(
                      item.product,
                      item.color,
                      lang,
                    );
                    const imageClass =
                      item.product.imageFit === 'contain'
                        ? 'w-20 h-20 object-contain rounded bg-[#f8f5ef] p-1'
                        : 'w-20 h-20 object-cover rounded';

                    return (
                      <div
                        key={`${item.product.id}-${item.size}-${item.color}`}
                        className="flex gap-4"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={productName}
                          className={imageClass}
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">
                            {productName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {item.size} / {colorLabel}
                          </p>
                          <p className="text-sm text-gold mt-1">
                            {formatPrice(price)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity - 1,
                                )
                              }
                              className="text-muted-foreground hover:text-foreground"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity + 1,
                                )
                              }
                              className="text-muted-foreground hover:text-foreground"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(
                              item.product.id,
                              item.size,
                              item.color,
                            )
                          }
                          className="text-muted-foreground hover:text-foreground self-start"
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 ? (
              <div className="p-6 border-t border-border">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {t('Total', 'Total')}
                  </span>
                  <span className="font-heading text-lg text-gold">
                    {formatPrice(totalUSD)}
                  </span>
                </div>
                <Link to="/checkout" onClick={() => setIsOpen(false)}>
                  <Button variant="gold" className="w-full">
                    {t('Order Request', 'Cerere de comanda')}
                  </Button>
                </Link>
              </div>
            ) : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default CartDrawer;
