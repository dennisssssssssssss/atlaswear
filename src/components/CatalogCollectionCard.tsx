import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  CatalogCollection,
  catalogSourceLabels,
} from '@/data/women-catalog';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedText } from '@/lib/i18n';

interface CatalogCollectionCardProps {
  collection: CatalogCollection;
  index?: number;
}

const CatalogCollectionCard = ({
  collection,
  index = 0,
}: CatalogCollectionCardProps) => {
  const { lang, t } = useLanguage();
  const sourceLabel = getLocalizedText(
    catalogSourceLabels[collection.source],
    lang,
  );
  const styleCount =
    collection.count !== null
      ? t(`${collection.count} styles`, `${collection.count} stiluri`)
      : t('Open collection', 'Deschide colectia');

  return (
    <motion.a
      href={collection.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-2xl bg-surface border border-border">
        <div className="aspect-[4/5] overflow-hidden bg-[#f7f1e7]">
          <img
            src={collection.image}
            alt={getLocalizedText(collection.name, lang)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="bg-background/80 backdrop-blur-sm border border-border text-[10px] tracking-[0.24em] uppercase px-3 py-1 rounded-full">
            {sourceLabel}
          </span>
          {collection.tags.includes('modest') ? (
            <span className="bg-gold text-primary-foreground text-[10px] tracking-[0.22em] uppercase px-3 py-1 rounded-full">
              {t('Modest Edit', 'Edit modest')}
            </span>
          ) : null}
        </div>

        <div className="p-5">
          <p className="text-[11px] tracking-[0.24em] uppercase text-gold mb-2">
            {styleCount}
          </p>
          <h3 className="text-base md:text-lg font-medium leading-snug">
            {getLocalizedText(collection.name, lang)}
          </h3>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-gold transition-colors">
            {t('Open Original Gallery', 'Deschide galeria originala')}
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default CatalogCollectionCard;
