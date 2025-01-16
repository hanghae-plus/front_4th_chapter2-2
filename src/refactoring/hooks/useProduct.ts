import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);
  const updateProduct = (product: Product) => {
    setProducts(
      products.map((item) => (item.id === product.id ? product : item))
    );
  };
  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
