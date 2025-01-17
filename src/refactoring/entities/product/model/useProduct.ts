import { useState } from 'react';
import { Product } from '../../../../types';

export const useProduct = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const calculateNewProduct = (updatedProduct: Product) => {
    const newProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product,
    );
    return newProducts;
  };
  const updateProduct = (updatedProduct: Product) => {
    setProducts(calculateNewProduct(updatedProduct));
  };

  return { products, updateProduct, addProduct };
};
