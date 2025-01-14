import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts.filter(p => p.id !== product.id), product]);
  };

  const addProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  } as const;
};
