import { useMemo } from "react";

import { useProducts } from "@/data/products";
import { useSourceProducts } from "@/hooks/use-source-products";
import {
  attachRelatedProducts,
  buildCatalogCategories,
  mapProductToCatalogProduct,
  mapSourceProductToCatalogProduct,
} from "@/lib/catalog";

export const useCatalogProducts = () => {
  const sourceQuery = useSourceProducts();
  const productsQuery = useProducts();

  const products = useMemo(() => {
    const baseProducts = (sourceQuery.data ?? []).map(mapSourceProductToCatalogProduct);
    const atlasProducts = (productsQuery.data ?? []).map(mapProductToCatalogProduct);
    return attachRelatedProducts([...baseProducts, ...atlasProducts]);
  }, [productsQuery.data, sourceQuery.data]);

  const categories = useMemo(
    () => buildCatalogCategories(products),
    [products],
  );

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const brands = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.brand))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [products],
  );

  return {
    data: productsQuery.data,
    error: productsQuery.error ?? sourceQuery.error,
    isError: productsQuery.isError || sourceQuery.isError,
    isFetching: productsQuery.isFetching || sourceQuery.isFetching,
    isLoading: productsQuery.isLoading || sourceQuery.isLoading,
    isPending: productsQuery.isPending || sourceQuery.isPending,
    refetch: productsQuery.refetch,
    products,
    categories,
    productMap,
    brands,
  };
};
