import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Globe, Menu, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useCart } from '@/contexts/CartContext';
import { Currency, useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';

const currencies: Currency[] = ['USD', 'EUR', 'RON'];

const Header = () => {
  const { currency, setCurrency } = useCurrency();
  const { lang, setLang, t } = useLanguage();
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/shop', label: t('Shop', 'Magazin') },
    { to: '/catalog', label: t('Catalog', 'Catalog') },
    { to: '/shop?category=clothing', label: t('Clothing', 'Imbracaminte') },
    { to: '/shop?category=shoes', label: t('Shoes', 'Incaltaminte') },
    { to: '/shop?category=bags', label: t('Bags', 'Genti') },
    { to: '/contact', label: t('Contact', 'Contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <button
          onClick={() => setMobileOpen((current) => !current)}
          className="lg:hidden text-foreground"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link
          to="/"
          className="font-heading text-xl md:text-2xl tracking-[0.3em] text-gold font-semibold"
        >
          ATLAS CO.
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-xs tracking-wider">
            {currencies.map((value) => (
              <button
                key={value}
                onClick={() => setCurrency(value)}
                className={`px-2 py-1 transition-colors ${
                  currency === value
                    ? 'text-gold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'ro' : 'en')}
            className="flex items-center gap-1 text-xs tracking-wider text-muted-foreground hover:text-gold transition-colors"
          >
            <Globe size={14} />
            {lang.toUpperCase()}
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="relative text-foreground hover:text-gold transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-background border-b border-border"
          >
            <nav className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                {currencies.map((value) => (
                  <button
                    key={value}
                    onClick={() => setCurrency(value)}
                    className={`px-2 py-1 text-xs ${
                      currency === value ? 'text-gold' : 'text-muted-foreground'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Header;
