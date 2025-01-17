import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProductList = (initialProductList: Product[]) => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);

  const updateProduct = (updatedProduct: Product) => {
    setProductList((prevProductList) =>
      prevProductList.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  };

  const addProduct = (newProduct: Product) => {
    setProductList((prevProductList) => [...prevProductList, newProduct]);
  };

  return { productList, updateProduct, addProduct };
};
