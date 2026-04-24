import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { motion } from 'framer-motion';

import CatalogCollectionCard from '@/components/CatalogCollectionCard';
import { Button } from '@/components/ui/button';
import {
  CatalogSectionId,
  catalogSections,
  catalogSourceLabels,
  womenCatalogCollections,
} from '@/data/women-catalog';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageMeta } from '@/hooks/use-page-meta';
import { getLocalizedText } from '@/lib/i18n';

const Catalog = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');

  const sectionIds = new Set(catalogSections.map((section) => section.id));
  const sourceIds = new Set(womenCatalogCollections.map((item) => item.source));

  const activeSection = searchParams.get('section') as CatalogSectionId | null;
  const activeSource = searchParams.get('source');

  const validSection = activeSection && sectionIds.has(activeSection);
  const validSource = activeSource && sourceIds.has(activeSource);

  const filteredCollections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return womenCatalogCollections.filter((collection) => {
      if (validSection && collection.section !== activeSection) {
        return false;
      }

      if (validSource && collection.source !== activeSource) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const localizedName = getLocalizedText(collection.name, lang).toLowerCase();
      const sourceLabel = getLocalizedText(
        catalogSourceLabels[collection.source],
        lang,
      ).toLowerCase();

      return (
        localizedName.includes(normalizedQuery) ||
        sourceLabel.includes(normalizedQuery)
      );
    });
  }, [activeSection, activeSource, lang, query, validSection, validSource]);

  const modestCollections = useMemo(
    () =>
      womenCatalogCollections.filter((collection) =>
        collection.tags.includes('modest'),
      ),
    [],
  );

  usePageMeta({
    title: t('Full Women Catalog', 'Catalog complet femei'),
    description: t(
      'Browse the full women catalog with dresses, bags, shoes, accessories, and a modest dress edit.',
      'Rasfoieste catalogul complet de femei cu rochii, genti, pantofi, accesorii si un edit modest de rochii.',
    ),
    path: '/catalog',
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
            {t('Full Women Catalog', 'Catalog complet femei')}
          </p>
          <h1 className="font-heading text-4xl md:text-6xl leading-[0.95]">
            {t(
              'Everything women, organized cleanly.',
              'Tot ce tine de femei, organizat curat.',
            )}
          </h1>
          <p className="text-muted-foreground text-lg mt-5 max-w-2xl">
            {t(
              'This page gathers the full women source catalog we mapped for you: dresses, shoes, bags, accessories, and a modest-ready edit for church-friendly silhouettes.',
              'Pagina asta aduna catalogul complet de femei pe care l-am mapat pentru tine: rochii, pantofi, genti, accesorii si un edit mai modest pentru siluete potrivite si pentru biserica.',
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link to="/shop">
              <Button variant="gold">
                {t('See Curated Storefront', 'Vezi storefront-ul curatat')}
              </Button>
            </Link>
            <a href="#modest-edit">
              <Button variant="gold-outline">
                {t('Open Modest Edit', 'Vezi editul modest')}
              </Button>
            </a>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs tracking-[0.28em] uppercase text-gold mb-2">
              {t('Collections', 'Colectii')}
            </p>
            <p className="text-3xl font-heading">{womenCatalogCollections.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs tracking-[0.28em] uppercase text-gold mb-2">
              {t('Sources', 'Surse')}
            </p>
            <p className="text-3xl font-heading">{sourceIds.size}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs tracking-[0.28em] uppercase text-gold mb-2">
              {t('Modest Edit', 'Edit modest')}
            </p>
            <p className="text-3xl font-heading">{modestCollections.length}</p>
          </div>
        </div>

        <section id="modest-edit" className="scroll-mt-24 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
                {t('Church & Modest', 'Biserica si modest')}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl">
                {t('Modest Dress Edit', 'Edit de rochii modeste')}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              {t(
                'I pulled together the collections that skew more covered, midi or maxi, and easier to style in a cleaner, church-friendly direction.',
                'Am strans aici colectiile care merg mai mult pe croieli acoperite, midi sau maxi, si care sunt mai usor de stilizat intr-o directie mai cuminte, buna si pentru biserica.',
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modestCollections.slice(0, 12).map((collection, index) => (
              <CatalogCollectionCard
                key={collection.id}
                collection={collection}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="py-8">
          <div className="flex flex-col xl:flex-row gap-6 xl:items-end xl:justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
                {t('Browse Everything', 'Rasfoieste tot')}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl">
                {t('All Women Collections', 'Toate colectiile de femei')}
              </h2>
            </div>

            <div className="w-full xl:w-[340px]">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t(
                  'Search collections or sources',
                  'Cauta colectii sau surse',
                )}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs tracking-[0.28em] uppercase text-gold mb-3">
                {t('Section', 'Sectiune')}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    searchParams.delete('section');
                    setSearchParams(searchParams);
                  }}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border rounded-full transition-colors ${
                    !validSection
                      ? 'border-gold text-gold'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('All', 'Toate')}
                </button>
                {catalogSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      searchParams.set('section', section.id);
                      setSearchParams(searchParams);
                    }}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border rounded-full transition-colors ${
                      activeSection === section.id
                        ? 'border-gold text-gold'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {getLocalizedText(section.label, lang)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.28em] uppercase text-gold mb-3">
                {t('Source', 'Sursa')}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    searchParams.delete('source');
                    setSearchParams(searchParams);
                  }}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border rounded-full transition-colors ${
                    !validSource
                      ? 'border-gold text-gold'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('All Sources', 'Toate sursele')}
                </button>
                {Array.from(sourceIds).map((source) => (
                  <button
                    key={source}
                    onClick={() => {
                      searchParams.set('source', source);
                      setSearchParams(searchParams);
                    }}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border rounded-full transition-colors ${
                      activeSource === source
                        ? 'border-gold text-gold'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {getLocalizedText(catalogSourceLabels[source], lang)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            {filteredCollections.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface p-10 text-center text-muted-foreground">
                {t(
                  'No collections matched these filters yet.',
                  'Nu s-au gasit colectii pentru filtrele astea.',
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredCollections.map((collection, index) => (
                  <CatalogCollectionCard
                    key={collection.id}
                    collection={collection}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Catalog;
