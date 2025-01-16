import { useCallback, useMemo, useState } from "react";
import { Product } from "../../types";

interface PriceRange {
  min?: number;
  max?: number;
}

interface UseProductSearchReturn {
  searchQuery: string;
  priceRange: PriceRange;
  filteredProducts: Product[];
  handleSearch: (query: string) => void;
  handlePriceRange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => void;
  totalResults: number;
}

export function useProductSearch(products: Product[]): UseProductSearchReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>({});

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handlePriceRange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
      const value = e.target.value ? Number(e.target.value) : undefined;
      setPriceRange((prev) => ({
        ...prev,
        [type]: value,
      }));
    },
    []
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesMinPrice =
        !priceRange.min || product.price >= priceRange.min;
      const matchesMaxPrice =
        !priceRange.max || product.price <= priceRange.max;

      return matchesQuery && matchesMinPrice && matchesMaxPrice;
    });
  }, [products, searchQuery, priceRange]);

  return {
    searchQuery,
    priceRange,
    filteredProducts,
    handleSearch,
    handlePriceRange,
    totalResults: filteredProducts.length,
  };
}
