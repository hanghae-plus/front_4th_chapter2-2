import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = (newProduct: Product) => {
    setProducts((prevProduct) =>
      prevProduct.map((product) => (product.id === newProduct.id ? { ...newProduct } : product))
    );
  };
  const addProduct = (newProduct: Product) => {
    setProducts((prevProduct) => [...prevProduct, newProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
