import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // 상품 수정
  const updateProduct = (newProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === newProduct.id ? newProduct : product))
    );
  };

  // 신규 상품 추가
  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return { products, updateProduct, addProduct };
};
