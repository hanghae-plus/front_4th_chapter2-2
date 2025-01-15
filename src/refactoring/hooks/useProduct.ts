import { useState } from 'react';
import { Product } from '../../types.ts';
import { usePreservedCallback } from './usePreservedCallback.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = usePreservedCallback((product: Product) => {
    setProducts((prev) => {
      if (isExistProduct(prev, product)) return prev;
      return [...prev, product];
    });
  });

  const updateProduct = usePreservedCallback((product: Product) => {
    setProducts((prev) => prev.map((current) => (current.id === product.id ? product : current)));
  });

  return {
    products,
    setProducts,
    addProduct,
    updateProduct,
  };
};

// Utils
const isExistProduct = (products: Product[], product: Product) => {
  return products.some((current) => current.id === product.id);
};
