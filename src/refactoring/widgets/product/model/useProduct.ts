import { useState } from 'react';
import { IProduct } from '../../../shared/types';

export const useProducts = (initialProducts: IProduct[]) => {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);

  const updateProduct = (product: IProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.id ? product : p)),
    );
  };

  const addProduct = (product: IProduct) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  return { products, updateProduct, addProduct };
};
