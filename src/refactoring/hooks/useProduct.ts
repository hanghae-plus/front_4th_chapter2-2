import { useState } from 'react';
import { PickPartial, Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const updateProduct = (updatedProduct: PickPartial<Product, 'id'>) => {
    setProducts((prevProducts) => {
      const existingItem = prevProducts.find(
        (product) => product.id === updatedProduct.id,
      );

      if (!existingItem) return prevProducts;

      return prevProducts.map((product) =>
        product.id === updatedProduct.id
          ? { ...product, ...updatedProduct }
          : product,
      );
    });
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
