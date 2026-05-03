import { useMemo } from "react";

import { useProducts } from "@/data/products";
import {
  attachRelatedProducts,
  buildCatalogCategories,
} from "@/lib/catalog";

export const useCatalogProducts = () => {
  const productsQuery = useProducts();

  const products = useMemo(() => {
    return attachRelatedProducts(productsQuery.data ?? []);
  }, [productsQuery.data]);

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
    error: productsQuery.error,
    isError: productsQuery.isError,
    isFetching: productsQuery.isFetching,
    isLoading: productsQuery.isLoading,
    isPending: productsQuery.isPending,
    refetch: productsQuery.refetch,
    products,
    categories,
    productMap,
    brands,
  };
};
