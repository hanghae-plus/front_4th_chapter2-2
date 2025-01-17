import { useState } from 'react';
import { Product } from '../../types';

export const useProductEditForm = () => {
  const [formState, setFormState] = useState<Product | null>(null);

  const updateFormHandler = (newProductField: Partial<Product>, id: string) => {
    setFormState(prev => {
      if (prev?.id !== id) return prev;
      return { ...prev, ...newProductField };
    });
  };

  const handleEditProduct = (product: Product) => {
    setFormState({ ...product });
  };

  const resetForm = () => {
    setFormState(null);
  };
  return { updateFormHandler, formState, handleEditProduct, resetForm };
};
