import { useState } from "react";
import { Product } from "../../types.ts";

interface ProductsState {
  products: Array<Product>;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Product) => void;
}

export const useProducts = (initialProducts: Array<Product>): ProductsState => {
  const [products, setProducts] = useState<Array<Product>>(initialProducts);

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  return { products, updateProduct, addProduct };
};
