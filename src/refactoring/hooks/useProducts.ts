import { useState } from "react";
import { Product } from "../../types";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const removeProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]): number => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  return {
    products,
    updateProduct,
    addProduct,
    removeProduct,
    getMaxDiscount,
  };
};