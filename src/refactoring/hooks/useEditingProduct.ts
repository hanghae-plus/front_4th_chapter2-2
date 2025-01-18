import { useState } from "react";
import { Product } from "../../types";

export const useEditingProduct = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 새로운 핸들러 함수 추가
  const updateProductName = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName }; // 제대로 수정이 되었느냐? -> 궁금하다면 따로 순수함수로 빼야!
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
    setEditingProduct, // 흠.....이게 의미있나?
    updateProductName,
    updateProductPrice,
    completeProductEdit,
  };
};
