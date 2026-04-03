import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-heading text-xl tracking-[0.3em] text-gold mb-4">ATLAS CO.</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('Freedom in every stitch. Movement in every design.', 'Libertate în fiecare cusătură. Mișcare în fiecare design.')}
          </p>
        </div>
        <div>
          <h4 className="text-sm tracking-widest uppercase text-gold mb-4">{t('Shop', 'Magazin')}</h4>
          <div className="flex flex-col gap-2">
            {['Clothing', 'Shoes', 'Belts', 'Bags', 'T-Shirts'].map(cat => (
              <Link key={cat} to={`/shop?category=${cat.toLowerCase().replace(' ', '-')}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {cat}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm tracking-widest uppercase text-gold mb-4">{t('Company', 'Companie')}</h4>
          <div className="flex flex-col gap-2">
            {[t('About', 'Despre'), t('Contact', 'Contact'), t('Shipping', 'Livrare')].map(item => (
              <span key={item} className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm tracking-widest uppercase text-gold mb-4">{t('Follow Us', 'Urmărește-ne')}</h4>
          <div className="flex flex-col gap-2">
            {['Instagram', 'TikTok', 'YouTube'].map(s => (
              <span key={s} className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">{s}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-6 text-center text-xs text-muted-foreground tracking-wider">
          © 2026 ATLAS CO. {t('All rights reserved.', 'Toate drepturile rezervate.')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
