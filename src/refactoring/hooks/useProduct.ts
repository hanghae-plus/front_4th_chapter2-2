import { useState } from 'react';
import { Product } from '../../types';

/**
 * 상품 목록을 관리하는 커스텀 훅
 */
export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (product: Product) => {
    setProducts((prevProducts) => updateProductInList(prevProducts, product));
  };

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => addProductToList(prevProducts, product));
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};

/**
 * 기존 제품 목록에서 제품을 업데이트하는 순수 함수
 */
const updateProductInList = (products: Product[], updatedProduct: Product): Product[] =>
  products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product));

/**
 * 새로운 제품을 목록에 추가하는 순수 함수
 */
const addProductToList = (products: Product[], newProduct: Product): Product[] => [
  ...products,
  newProduct,
];
