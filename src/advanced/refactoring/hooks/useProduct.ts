import { useCallback } from 'react';
import { Product } from '../models/types/Product.ts';
import { useProductContext } from '../components/shared/product/context/useProductContext.ts';

export const useProducts = () => {
  const { products, setProducts } = useProductContext();

  const updateProduct = useCallback(
    (updatedProduct: Product) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product,
        ),
      );
    },
    [setProducts],
  );

  const addProduct = useCallback(
    (product: Product) => {
      setProducts((prevProducts) => [...prevProducts, product]);
    },
    [setProducts],
  );

  return {
    products,
    setProducts,
    updateProduct,
    addProduct,
  };
};
