import { useState } from 'react';
import { Discount, Product } from '../../types';

export const useProductDiscount = (
  editingProduct: Product | null,
  setEditingProduct: (product: Product) => void,
  productList: Product[],
  onProductUpdate: (updatedProduct: Product) => void,
) => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const addDiscount = (productId: string) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const removeDiscount = (productId: string, index: number) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const updateDiscount = (newDiscount: Discount) => {
    setNewDiscount(newDiscount);
  };

  return {
    newDiscount,
    addDiscount,
    updateDiscount,
    removeDiscount,
  };
};
