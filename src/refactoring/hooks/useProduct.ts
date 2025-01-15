import { useState } from 'react';
import { Product } from '../../types.ts';
import { updateProductList } from '../models';

export const useProducts = (initialProductList: Product[]) => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);

  // 상품리스트 업데이트
  const handleUpdateProductList = (updatedProduct: Product) => {
    setProductList((prevProductList) =>
      updateProductList(prevProductList, updatedProduct),
    );
  };

  // 새 상품 추가
  const handleAddProduct = (newProduct: Product) => {
    setProductList((prevProductList) => [...prevProductList, newProduct]);
  };

  return {
    products: productList,
    updateProduct: handleUpdateProductList,
    addProduct: handleAddProduct,
  };
};
