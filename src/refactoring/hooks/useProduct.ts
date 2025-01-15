import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (targetProduct: Product) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === targetProduct.id ? targetProduct : product)),
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return { products, updateProduct, addProduct };
};
