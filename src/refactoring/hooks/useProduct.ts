import { useState } from 'react';
import { ProductType } from '../types';

type ProductAction =
  | { type: 'update'; product: ProductType }
  | { type: 'add'; product: ProductType };

/**
 * 제품 목록을 업데이트하거나 새로운 제품을 추가하는 순수 함수
 *
 * @param {ProductType[]} productList - 현재 제품 목록
 * @param {ProductAction} action - 작업 유형과 제품 객체
 * @returns {ProductType[]} 업데이트된 제품 목록
 */
const manageProducts = (productList: ProductType[], action: ProductAction): ProductType[] => {
  switch (action.type) {
    case 'update':
      return productList.map((p) => (p.id === action.product.id ? action.product : p));
    case 'add':
      return [...productList, action.product];
    default:
      return productList;
  }
};

/**
 * 제품 목록 상태 관리 및 제품 업데이트/추가 훅
 *
 * @param {ProductType[]} initialProducts - 초기 제품 목록
 * @returns {{
 *   productList: ProductType[],
 *   updateProduct: (updatedProduct: Product) => void,
 *   addProduct: (newProduct: Product) => void
 * }} 상태 관리 함수(productList, updateProduct, addProduct)를 반환
 */
export const useProducts = (initialProductList: ProductType[]) => {
  const [productList, setProductList] = useState<ProductType[]>(initialProductList);

  // 상태 업데이트를 처리하는 함수
  const dispatch: (action: ProductAction) => void = (action) => {
    setProductList((prevProductList) => manageProducts(prevProductList, action));
  };

  // 제품을 업데이트하는 함수
  const updateProduct = (updatedProduct: ProductType) =>
    dispatch({ type: 'update', product: updatedProduct });

  // 새로운 제품을 추가하는 함수
  const addProduct = (newProduct: ProductType) => dispatch({ type: 'add', product: newProduct });

  return { productList, updateProduct, addProduct };
};
