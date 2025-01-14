import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [productList, setProductList] = useState<Product[]>(() => initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProductList((previous) =>
      previous.map((item) => (item.id === updatedProduct.id ? updatedProduct : item)),
    );
  };

  const addProduct = (product: Product) => {
    setProductList((previous) => [...previous, product]);
  };

  return {
    productList,
    updateProduct,
    addProduct,
  };
};
