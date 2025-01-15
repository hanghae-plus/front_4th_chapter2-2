import { useLocalStorage } from './useLocalStorage.ts';

import type { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const { storageItem: products, setItem: setProducts } = useLocalStorage('products', initialProducts);

  const updateProduct = (newProduct: Product) => {
    const updateProducts = products.map((product) => (product.id === newProduct.id ? newProduct : product));

    setProducts(updateProducts);
  };

  const addProduct = (product: Product) => {
    const updateProducts = [...products, product];

    setProducts(updateProducts);
  };

  return { products, updateProduct, addProduct };
};
