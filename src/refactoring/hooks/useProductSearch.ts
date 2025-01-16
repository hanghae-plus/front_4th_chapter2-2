import { useState } from "react";
import type { ChangeEvent } from "react";
import { Product } from "../../types.ts";
import { debounce } from "../utils";

export const useProductSearch = (products: Product[]) => {
  const [word, setWord] = useState("");

  const handleSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  }, 300);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(word.toLowerCase()),
  );

  return { handleSearch, filteredProducts };
};
