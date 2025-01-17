import { useState } from 'react';
import { Product } from '../../types.ts';

// 1-1. 상품 목록 나타내기
export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updateProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updateProduct.id ? updateProduct : p))
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return { products, updateProduct, addProduct };
};
