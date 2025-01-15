import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  // 특정 제품으로 초기화 할 수 있다.
  cosnt[(products, setProducts)] = useState<Product[]>(initialProducts);

  // 제품을 업데이트 할 수 있다.
  const updateProduct = (productId: string, updateProduct: Product) => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, ...updateProduct };
        }
      });
    });
  };

  // 새로운 제품을 추가할 수 있다.
  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
