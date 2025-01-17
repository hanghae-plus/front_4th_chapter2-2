import { useState } from "react";
import { Product } from "../../types.ts";

const calculateUpdateProducts = (
  products: Product[],
  updatedProduct: Product
): Product[] => {
  return products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
};

const calculateAddProduct = (products: Product[], newProduct: Product) => {
  return [...products, newProduct];
};

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      calculateUpdateProducts(prevProducts, updatedProduct)
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) =>
      calculateAddProduct(prevProducts, newProduct)
    );
  };

  return { products, updateProduct, addProduct };
};
