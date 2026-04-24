import { Link } from 'react-router-dom';

import { siteConfig } from '@/config/site';
import { categories, getLocalizedText } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { lang, t } = useLanguage();
  const companyLinks = [
    { to: '/contact', label: t('Contact', 'Contact') },
    { to: '/shipping', label: t('Shipping', 'Livrare') },
    { to: '/returns', label: t('Returns', 'Retururi') },
    { to: '/privacy', label: t('Privacy', 'Confidentialitate') },
    { to: '/terms', label: t('Terms', 'Termeni') },
  ];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-heading text-xl tracking-[0.3em] text-gold mb-4">
            ATLAS CO.
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'Freedom in every stitch. Movement in every design.',
              'Libertate in fiecare cusatura. Miscare in fiecare design.',
            )}
          </p>
        </div>

        <div>
          <h4 className="text-sm tracking-widest uppercase text-gold mb-4">
            {t('Shop', 'Magazin')}
          </h4>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {getLocalizedText(category.label, lang)}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm tracking-widest uppercase text-gold mb-4">
            {t('Company', 'Companie')}
          </h4>
          <div className="flex flex-col gap-2">
            {companyLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm tracking-widest uppercase text-gold mb-4">
            {t('Follow Us', 'Urmareste-ne')}
          </h4>
          <div className="flex flex-col gap-2">
            {siteConfig.socialLinks.map((link) =>
              link.url ? (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <span
                  key={link.label}
                  className="text-sm text-muted-foreground/70"
                >
                  {link.label} {t('(soon)', '(curand)')}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-6 text-center text-xs text-muted-foreground tracking-wider">
          &copy; {year} {siteConfig.brandName}.{' '}
          {t('All rights reserved.', 'Toate drepturile rezervate.')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
