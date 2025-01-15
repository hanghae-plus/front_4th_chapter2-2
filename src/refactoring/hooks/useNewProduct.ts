import { useState } from 'react';
import { NewProduct, Product } from '../../types';

export const useNewProduct = (
  onProductAdd: (newProduct: Product) => void,
  setShowNewProductForm: (showNewProductForm: boolean) => void,
) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  return { newProduct, setNewProduct, handleAddNewProduct };
};
