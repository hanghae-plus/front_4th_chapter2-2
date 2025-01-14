import { useState } from 'react';
import { Product } from '../../types';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  //특정 제품 정보를 업데이트
  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  //새로운 제품 추가
  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // 현재 제품 상태 및 변경 함수 반환
  return { products, updateProduct, addProduct };
};
