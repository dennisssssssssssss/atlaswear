import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  hasNewsletterChannel,
  publicSupportEmail,
  siteConfig,
} from '@/config/site';
import { categories, getLocalizedText, products } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageMeta } from '@/hooks/use-page-meta';

const Index = () => {
  const { lang, t } = useLanguage();
  const [email, setEmail] = useState('');
  const featuredProducts = products.filter((product) => product.featured);
  const firstActiveSocial = siteConfig.socialLinks.find((link) =>
    Boolean(link.url),
  );

  usePageMeta({ path: '/' });

  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!publicSupportEmail) {
      toast({
        title: t(
          'Updates are not live yet',
          'Lista de update-uri nu este live inca',
        ),
        description: t(
          'Follow the brand on social until the contact inbox is configured.',
          'Urmareste brandul pe social media pana cand inboxul de contact este configurat.',
        ),
      });
      return;
    }

    window.location.href = `mailto:${publicSupportEmail}?subject=${encodeURIComponent(
      'ATLAS updates request',
    )}&body=${encodeURIComponent(
      `Please add this email to the ATLAS updates list:\n\n${email}`,
    )}`;

    toast({
      title: t('Email draft prepared', 'Draftul de email este pregatit'),
      description: t(
        'Your email app should open so you can confirm the request directly.',
        'Aplicatia ta de email ar trebui sa se deschida ca sa poti confirma cererea direct.',
      ),
    });
    setEmail('');
  };

  return (
    <div className="min-h-screen">
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
            {t("The Women's Edit", 'Editia pentru femei')}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.9] mb-8">
            ATLAS CO.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-10">
            {t(
              'Curated women pieces, premium silhouettes, and launch pricing designed to move fast.',
              'Piese curate pentru femei, siluete premium si preturi de lansare gandite sa fie foarte atractive.',
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button variant="gold" size="lg" className="text-sm px-10">
                {t('Shop Women', 'Vezi colectia de femei')}
              </Button>
            </Link>
            <Link to="/catalog">
              <Button
                variant="gold-outline"
                size="lg"
                className="text-sm px-10"
              >
                {t('Full Women Catalog', 'Catalog complet femei')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
              {t('Collections', 'Colectii')}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl">
              {t('Shop by Category', 'Cumpara pe categorii')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/shop?category=${category.id}`}
                  className="group block relative overflow-hidden rounded aspect-[3/4]"
                >
                  <img
                    src={category.image}
                    alt={getLocalizedText(category.label, lang)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm tracking-[0.2em] uppercase font-medium">
                      {getLocalizedText(category.label, lang)}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-border bg-surface/60">
        <div className="container">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
                {t('Source Catalog', 'Catalog sursa')}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl mb-4">
                {t(
                  'All women categories now live in one place.',
                  'Toate categoriile de femei sunt acum intr-un singur loc.',
                )}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                {t(
                  'Use the full catalog page to browse the large source sets cleanly, including bags, shoes, accessories, and a modest dress edit for church-ready styling.',
                  'Foloseste pagina de catalog complet ca sa rasfoiesti curat seturile mari din surse, inclusiv genti, pantofi, accesorii si un edit de rochii mai modeste pentru styling potrivit si pentru biserica.',
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Link to="/catalog">
                <Button variant="gold" className="w-full sm:w-auto">
                  {t('Browse Full Catalog', 'Rasfoieste catalogul complet')}
                </Button>
              </Link>
              <Link to="/catalog#modest-edit">
                <Button variant="gold-outline" className="w-full sm:w-auto">
                  {t('Modest Dress Edit', 'Edit de rochii modeste')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
                {t('Curated', 'Selectat')}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl">
                {t('Featured Pieces', 'Piese selectate')}
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors tracking-wider uppercase"
            >
              {t('View All', 'Vezi tot')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-2xl text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
            {t('Stay Connected', 'Ramai conectat')}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl mb-4">
            {t('Join the Journey', 'Alatura-te calatoriei')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t(
              'Be the first to know about new drops, exclusive offers, and stories from around the world.',
              'Fii primul care afla despre lansari, oferte exclusive si povesti din intreaga lume.',
            )}
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('Your email', 'Email-ul tau')}
              className="flex-1 bg-surface border border-border rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
              required
            />
            <Button
              variant="gold"
              type="submit"
              className="text-sm"
              disabled={!hasNewsletterChannel}
            >
              {hasNewsletterChannel
                ? t('Request Updates', 'Cere update-uri')
                : t('Coming Soon', 'In curand')}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            {hasNewsletterChannel
              ? t(
                  'This opens your email app so you can confirm the request directly.',
                  'Aceasta actiune iti deschide aplicatia de email ca sa poti confirma cererea direct.',
                )
              : firstActiveSocial
                ? t(
                    'The mailing list is being prepared. Follow the brand on social in the meantime.',
                    'Lista de email este in pregatire. Pana atunci, urmareste brandul pe social media.',
                  )
                : t(
                    'The mailing list is being prepared and will be activated soon.',
                    'Lista de email este in pregatire si va fi activata in curand.',
                  )}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
