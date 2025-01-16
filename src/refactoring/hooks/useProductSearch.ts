import { useMemo, useRef, useCallback, useState, useEffect } from "react";
import { Product } from "../../types";

export const useProductSearch = (products: Array<Product>) => {
  const searchQuery = useRef<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [searchTrigger, setSearchTrigger] = useState<number>(0);

  const setSearchQuery = useCallback((value: string) => {
    searchQuery.current = value;
    setInputValue(value);
  }, []);

  const handleSearch = useCallback(() => {
    setSearchTrigger((prev) => prev + 1);
  }, []);

  const resetSearch = useCallback(() => {
    searchQuery.current = "";
    setInputValue("");
    setSearchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    searchQuery.current = inputValue;
  }, [inputValue]);

  const searchResults = useMemo(() => {
    if (!searchQuery.current.trim()) {
      return products;
    }

    const normalizedQuery = searchQuery.current.toLowerCase().trim();

    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchTrigger]);

  return {
    searchQuery: inputValue,
    setSearchQuery,
    searchResults,
    handleSearch,
    resetSearch,
  };
};
