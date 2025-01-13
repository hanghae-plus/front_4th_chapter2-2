import { useState } from 'react';
import { Product } from '../../types.ts';

// 순수함수 분리??
const updateProductList = (prevProducts: Product[], updatedProduct: Product): Product[] => {
  return prevProducts.map(prevProduct => (prevProduct.id === updatedProduct.id ? updatedProduct : prevProduct));
};
const addProductList = (prevProducts: Product[], newProduct: Product): Product[] => {
  return [...prevProducts, newProduct];
};

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prevProducts => updateProductList(prevProducts, updatedProduct));
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts(prevProducts => addProductList(prevProducts, newProduct));
  };

  return { products: products, updateProduct: handleProductUpdate, addProduct: handleProductAdd };
};
