import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Index = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80"
            alt="ATLAS CO. Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative text-center px-4 max-w-3xl"
        >
          <p className="text-xs tracking-[0.5em] uppercase text-gold mb-6">
            {t('Global Fashion, Local Soul', 'Modă globală, suflet local')}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.9] mb-8">
            ATLAS CO.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-10">
            {t(
              'Freedom in every stitch. Movement in every design. Born to travel.',
              'Libertate în fiecare cusătură. Mișcare în fiecare design. Născut să călătorească.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button variant="gold" size="lg" className="text-sm px-10">
                {t('Shop Now', 'Cumpără acum')}
              </Button>
            </Link>
            <Link to="/shop?category=clothing">
              <Button variant="gold-outline" size="lg" className="text-sm px-10">
                {t('New Arrivals', 'Noutăți')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">{t('Collections', 'Colecții')}</p>
            <h2 className="font-heading text-3xl md:text-4xl">{t('Shop by Category', 'Cumpără pe categorii')}</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/shop?category=${cat.id}`} className="group block relative overflow-hidden rounded aspect-[3/4]">
                  <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm tracking-[0.2em] uppercase font-medium">{t(cat.label, cat.labelRo)}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-surface">
        <div className="container">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">{t('Curated', 'Selectat')}</p>
              <h2 className="font-heading text-3xl md:text-4xl">{t('Featured Pieces', 'Piese selectate')}</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors tracking-wider uppercase">
              {t('View All', 'Vezi tot')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 md:py-28">
        <div className="container max-w-2xl text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">{t('Stay Connected', 'Rămâi conectat')}</p>
          <h2 className="font-heading text-3xl md:text-4xl mb-4">
            {t('Join the Journey', 'Alătură-te călătoriei')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t('Be the first to know about new drops, exclusive offers, and stories from around the world.',
               'Fii primul care află despre lansări, oferte exclusive și povești din întreaga lume.')}
          </p>
          <form onSubmit={e => { e.preventDefault(); setEmail(''); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('Your email', 'Email-ul tău')}
              className="flex-1 bg-surface border border-border rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
              required
            />
            <Button variant="gold" type="submit" className="text-sm">
              {t('Subscribe', 'Abonează-te')}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Index;
