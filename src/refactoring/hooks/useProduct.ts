import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = (updateProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updateProduct.id ? updateProduct : p))
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return { products, updateProduct, addProduct };
};
