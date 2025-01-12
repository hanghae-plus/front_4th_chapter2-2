import { useState } from "react";
import { Discount, Product } from "../../types";

export const useEditingProduct = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  // 수정 완료 핸들러 함수 추가
  const clearEditingProduct = () => {
    setEditingProduct(null);
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, stock: newStock };
      setEditingProduct(updatedProduct);
    }
  };

  const handleAddDiscount = (productId: string, newDiscount: Discount) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = {
        ...editingProduct,
        discounts: [...editingProduct.discounts, newDiscount],
      };
      setEditingProduct(updatedProduct);
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = {
        ...editingProduct,
        discounts: editingProduct.discounts.filter((_, i) => i !== index),
      };
      setEditingProduct(updatedProduct);
    }
  };

  return {
    editingProduct,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    clearEditingProduct,
  };
};
