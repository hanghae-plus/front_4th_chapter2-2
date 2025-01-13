import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProductList: Product[]) => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);

  const handleUpdateProductList = (updatedProduct: Product) => {
    setProductList((prevProductList) =>
      prevProductList.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProductList((prevProductList) => [...prevProductList, newProduct]);
  };

  return {
    products: productList,
    updateProduct: handleUpdateProductList,
    addProduct: handleAddProduct,
  };
};
