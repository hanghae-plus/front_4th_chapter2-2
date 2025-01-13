import { useState } from 'react';

import type { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (newProduct: Product) => {
    const updateProducts = products.map((product) => (product.id === newProduct.id ? newProduct : product));

    setProducts(updateProducts);
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  return { products, updateProduct, addProduct };
};
