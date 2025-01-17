import { useState } from 'react';
import { Discount, Product } from '../../../../types';

interface UseProductEditFormProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
}

export const useProductEditForm = ({ product, onUpdate }: UseProductEditFormProps) => {
  const [editingProduct, setEditingProduct] = useState<Product>(product);

  const handleFieldChange = (field: keyof Product, value: string) => {
    setEditingProduct((prev) => ({
      ...prev,
      [field]: field === 'name' ? value : Number(value),
    }));
  };

  const handleDiscountUpdate = (updatedDiscounts: Discount[]) => {
    setEditingProduct((prev) => ({
      ...prev,
      discounts: updatedDiscounts,
    }));
  };

  const handleSubmit = () => {
    onUpdate(editingProduct);
  };

  return {
    editingProduct,
    handleFieldChange,
    handleDiscountUpdate,
    handleSubmit,
  };
};
