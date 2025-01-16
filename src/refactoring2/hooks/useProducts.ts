import { useEffect, useState } from 'react';
import { Product } from '../../types.ts';
import { useLocalStorage } from './useLocalStorage.ts';
import { usePreservedCallback } from './usePreservedCallback.ts';

export const useProducts = (initialProducts: Product[] = []) => {
  const { getItem, setItem } = useLocalStorage();

  const [products, setProducts] = useState<Product[]>(getItem('products') || initialProducts);

  useEffect(() => {
    setItem('products', products);
  }, [products]);

  const addProduct = usePreservedCallback((product: Product) => {
    setProducts((prev) => {
      const exist = prev.some((current) => current.id === product.id);
      return exist ? prev : [...prev, product];
    });
  });

  const updateProduct = usePreservedCallback((product: Product) => {
    setProducts((prev) => {
      return prev.map((current) => (current.id === product.id ? product : current));
    });
  });

  const deleteProduct = usePreservedCallback((id: string) => {
    setProducts((prev) => {
      return prev.filter((current) => current.id !== id);
    });
  });

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
