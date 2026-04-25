import { useQuery } from "@tanstack/react-query";

import { sourceProductsDataUrl, type SourceProduct } from "@/data/source-products";

export const sourceProductsQueryKey = ["source-products"];

export const useSourceProducts = () =>
  useQuery<SourceProduct[]>({
    queryKey: sourceProductsQueryKey,
    queryFn: async () => {
      const response = await fetch(sourceProductsDataUrl);

      if (!response.ok) {
        throw new Error(`Failed to load source catalog: ${response.status}`);
      }

      return response.json() as Promise<SourceProduct[]>;
    },
    staleTime: 1000 * 60 * 15,
  });
