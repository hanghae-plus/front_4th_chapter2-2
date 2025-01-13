import { useState } from 'react';
import { Product } from '../../types';

/**
 * 상품 목록을 관리하는 커스텀 훅
 */
export const useProduct = (initialProductList: Product[]) => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);

  const updateProduct = (product: Product) => {
    setProductList((prevProductList) => updateProductInList(prevProductList, product));
  };

  const addProduct = (product: Product) => {
    setProductList((prevProductList) => addProductToList(prevProductList, product));
  };

  return {
    productList,
    updateProduct,
    addProduct,
  };
};

/**
 * 기존 제품 목록에서 제품을 업데이트하는 순수 함수
 */
const updateProductInList = (productList: Product[], updatedProduct: Product): Product[] =>
  productList.map((product) => (product.id === updatedProduct.id ? updatedProduct : product));

/**
 * 새로운 제품을 목록에 추가하는 순수 함수
 */
const addProductToList = (productList: Product[], newProduct: Product): Product[] => [
  ...productList,
  newProduct,
];
