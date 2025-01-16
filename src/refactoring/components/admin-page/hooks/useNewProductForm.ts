import { useState } from 'react';
import { Product } from '../../../../types.ts';

export const useNewProductForm = () => {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const onChangeNewProduct = (key: 'name' | 'price' | 'stock', value: string | number) => {
    setNewProduct(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
  };

  return { newProduct, onChangeNewProduct, resetNewProduct };
};
