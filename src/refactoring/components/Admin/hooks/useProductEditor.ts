import { useState } from "react";
import { Product } from "../../../../types";

export const useProductEditor = (
  onProductUpdate: (product: Product) => void
) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleProductFieldUpdate = (
    productId: string,
    field: keyof Product,
    value: any
  ) => {
    if (editingProduct?.id === productId) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  return {
    editingProduct,
    setEditingProduct,
    handleEditProduct,
    handleProductFieldUpdate,
    handleEditComplete,
  };
};
