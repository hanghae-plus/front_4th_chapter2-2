import { useState } from 'react';
import { Product } from '../../types';

export const useProducts = (initialProductList: Product[]) => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);

  //특정 제품 정보를 업데이트
  const updateProduct = (updatedProduct: Product) => {
    setProductList((prevProductList) =>
      prevProductList.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  //새로운 제품 추가
  const addProduct = (newProduct: Product) => {
    setProductList((prevProductList) => [...prevProductList, newProduct]);
  };

  // 현재 제품 상태 및 변경 함수 반환
  return { productList, updateProduct, addProduct };
};
