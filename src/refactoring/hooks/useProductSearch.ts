import { Product } from "../../types.ts";
import { useState } from "react";
import type { ChangeEvent } from "react";

export const useProductSearch = (products: Product[]) => {
  const [word, setWord] = useState("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(word.toLowerCase()),
  );

  return { handleSearch, filteredProducts };
};
