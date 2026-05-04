import { Link } from "react-router-dom";

import CatalogImage from "@/components/CatalogImage";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { usePageMeta } from "@/hooks/use-page-meta";
import type { CatalogProduct } from "@/lib/catalog";

const featuredBrandNames = [
  "Balenciaga",
  "Burberry",
  "Celine",
  "Chanel",
  "Dior",
  "Fendi",
  "Gucci",
  "Hermes",
  "Louis Vuitton",
  "Prada",
  "Saint Laurent",
  "Valentino",
  "Versace",
];

interface BrandCardData {
  brand: string;
  product: CatalogProduct;
}

const getBrandUrl = (brand: string) => `/shop?brand=${encodeURIComponent(brand)}`;

const buildBrandCards = (products: CatalogProduct[]) => {
  const byBrand = new Map<string, CatalogProduct>();

  products.forEach((product) => {
    const current = byBrand.get(product.brand);

    if (!current) {
      byBrand.set(product.brand, product);
      return;
    }

    if ((product.photoCount ?? -1) > (current.photoCount ?? -1)) {
      byBrand.set(product.brand, product);
    }
  });

  return Array.from(byBrand.entries())
    .map(([brand, product]) => ({ brand, product }))
    .sort((left, right) => left.brand.localeCompare(right.brand));
};

const BrandCard = ({
  card,
  featured = false,
}: {
  card: BrandCardData;
  featured?: boolean;
}) => (
  <Link to={getBrandUrl(card.brand)} className="group block">
    <div className="overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 group-hover:border-gold">
      <div className="aspect-square">
        <CatalogImage
          src={card.product.images[0]}
          alt={card.brand}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          fallbackLabel={card.brand}
        />
      </div>
    </div>
    <p
      className={`mt-3 text-center uppercase tracking-[0.22em] text-gold ${
        featured ? "text-sm" : "text-[11px]"
      }`}
    >
      {card.brand}
    </p>
  </Link>
);

const Brands = () => {
  const { products, isLoading, isError } = useCatalogProducts();

  usePageMeta({
    title: "Branduri",
    description: "Branduri disponibile in catalogul ATLAS.",
    path: "/branduri",
  });

  const cards = buildBrandCards(products);
  const featuredSet = new Set(featuredBrandNames);
  const featuredCards = featuredBrandNames
    .map((brand) => cards.find((card) => card.brand === brand))
    .filter((card): card is BrandCardData => Boolean(card));
  const remainingCards = cards.filter((card) => !featuredSet.has(card.brand));

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-32 text-foreground">
      <div className="container">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Branduri</p>
          <h1 className="mt-4 font-heading text-4xl leading-tight md:text-6xl">
            Branduri disponibile
          </h1>
        </div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={`brand-loading-${index}`}
                className="aspect-square animate-pulse rounded-lg border border-border bg-card"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-10 rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
            Catalogul nu s-a putut incarca.
          </div>
        ) : (
          <>
            <section className="mt-10">
              <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Branduri principale
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
                {featuredCards.map((card) => (
                  <BrandCard key={card.brand} card={card} featured />
                ))}
              </div>
            </section>

            <section className="mt-14">
              <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Toate brandurile
              </h2>
              <div className="mt-5 grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5">
                {remainingCards.map((card) => (
                  <BrandCard key={card.brand} card={card} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Brands;
