import { useState } from 'react';
import { IDiscount, IProduct } from '../../../shared/types';

export const useEidtingProduct = (product: IProduct) => {
  const [editingProduct, setEditingProduct] = useState<IProduct>(product);

  const handleProductUpdate = (key: string, newValue: string | number) =>
    setEditingProduct({ ...editingProduct, [key]: newValue });

  const handleRemoveDiscount = (index: number) => {
    setEditingProduct((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }));
  };

  const handleAddProductDiscount = (newDiscount: IDiscount) => {
    setEditingProduct((prev) => ({
      ...prev,
      discounts: [...prev.discounts, newDiscount],
    }));
  };

  return {
    editingProduct,
    handleProductUpdate,
    handleRemoveDiscount,
    handleAddProductDiscount,
  };
};
