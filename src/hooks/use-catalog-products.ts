import { useMemo } from "react";

import { products as curatedProducts } from "@/data/products";
import { useSourceProducts } from "@/hooks/use-source-products";
import {
  attachRelatedProducts,
  buildCatalogCategories,
  mapProductToCatalogProduct,
  mapSourceProductToCatalogProduct,
} from "@/lib/catalog";

export const useCatalogProducts = () => {
  const query = useSourceProducts();

  const products = useMemo(() => {
    const baseProducts = (query.data ?? []).map(mapSourceProductToCatalogProduct);
    const atlasProducts = curatedProducts.map(mapProductToCatalogProduct);
    return attachRelatedProducts([...baseProducts, ...atlasProducts]);
  }, [query.data]);

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
    ...query,
    products,
    categories,
    productMap,
    brands,
  };
};
