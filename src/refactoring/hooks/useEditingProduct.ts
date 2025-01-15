import { useState } from "react";
import { Product } from "../../types";

export const useEditingProduct = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const startEditing = (product: Product) => setEditingProduct({ ...product });
  const stopEditing = () => setEditingProduct(null);

  const updateProductField = <T extends keyof Product>(field: T, value: Product[T]) => {
    if (editingProduct) {
      setEditingProduct(prev => (prev ? { ...prev, [field]: value } : null));
    }
  };

  return { editingProduct, startEditing, stopEditing, updateProductField};
};
