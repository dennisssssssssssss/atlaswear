import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CatalogCategoryStrip from "@/components/CatalogCategoryStrip";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  type SourceCategory,
  type SourceProductAudience,
} from "@/data/source-products";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  filterCatalogProductsByNavigation,
  normalizeCatalogUmbrella,
} from "@/lib/catalog-filters";
import type { CatalogProduct } from "@/lib/catalog";

const PAGE_SIZE = 24;

type DatedCatalogProduct = CatalogProduct & {
  dateAdded?: string;
  addedAt?: string;
};

const getProductDateTime = (product: CatalogProduct) => {
  const datedProduct = product as DatedCatalogProduct;
  const dateValue = datedProduct.dateAdded ?? datedProduct.addedAt;

  if (!dateValue) {
    return null;
  }

  const timestamp = Date.parse(dateValue);

  return Number.isNaN(timestamp) ? null : timestamp;
};

const sortNewestFirst = (products: CatalogProduct[]) =>
  [...products].sort((left, right) => {
    const leftDate = getProductDateTime(left);
    const rightDate = getProductDateTime(right);

    if (leftDate !== null && rightDate !== null && leftDate !== rightDate) {
      return rightDate - leftDate;
    }

    if (leftDate !== null && rightDate === null) {
      return -1;
    }

    if (leftDate === null && rightDate !== null) {
      return 1;
    }

    return right.id.localeCompare(left.id);
  });

const NewArrivals = () => {
  const [searchParams] = useSearchParams();
  const { products, isLoading, isError } = useCatalogProducts();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const activeCategory = searchParams.get("category") as SourceCategory | null;
  const activeUmbrella = normalizeCatalogUmbrella(searchParams.get("umbrella"));
  const activeAudience = searchParams.get("audience") as SourceProductAudience | null;

  usePageMeta({
    title: "Nou",
    description: "Produse adaugate recent in catalogul ATLAS.",
    path: searchParams.toString() ? `/nou?${searchParams.toString()}` : "/nou",
  });

  const filteredProducts = useMemo(() => {
    const navigationFiltered = filterCatalogProductsByNavigation(
      products,
      activeAudience,
      activeCategory,
      activeUmbrella,
    );

    return sortNewestFirst(navigationFiltered);
  }, [activeAudience, activeCategory, activeUmbrella, products]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeAudience, activeCategory, activeUmbrella]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = filteredProducts.length > visibleCount;

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-64 text-foreground lg:pt-48">
      <CatalogCategoryStrip />
      <div className="container">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">NOU</p>
          <h1 className="mt-4 font-heading text-4xl leading-tight md:text-6xl">
            Adaugate recent
          </h1>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={`new-loading-${index}`}
                  className="h-[430px] animate-pulse rounded-lg border border-border bg-card"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
              Catalogul nu s-a putut incarca.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
              Nu exista produse pentru filtrul ales.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 xl:grid-cols-4">
                {visibleProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {hasMoreProducts ? (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="gold"
                    onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
                  >
                    Vezi mai multe produse
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
