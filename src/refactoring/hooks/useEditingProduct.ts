import { useState } from "react";
import { Product } from "../../types";

export const useEditingProduct = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 새로운 핸들러 함수 추가
  const updateProductName = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const updateProductPrice = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  const completeProductEdit = () => {
    if (editingProduct) {
      setEditingProduct(null);
    }
  };

  return {
    editingProduct,
    setEditingProduct, // 흠.....
    updateProductName,
    updateProductPrice,
    completeProductEdit,
  };
};
