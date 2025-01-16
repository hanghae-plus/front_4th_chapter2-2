import { useState } from 'react';
import { Product } from '../../types';

/**
 * 상품 목록을 관리하는 커스텀 훅
 */
export const useProduct = (initialProductList: Product[]) => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);

  const updateProduct = (product: Product) => {
    setProductList((productList) =>
      productList.map((prevProduct) => (prevProduct.id === product.id ? product : prevProduct)),
    );
  };

  const addProduct = (product: Product) => {
    setProductList((productList) => [...productList, product]);
  };

  return {
    productList,
    updateProduct,
    addProduct,
  };
};
