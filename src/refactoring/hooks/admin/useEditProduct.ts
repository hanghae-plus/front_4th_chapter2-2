import { useState } from 'react';
import { Product } from '../../models/types/Product';

type Arguments = {
  currentProduct: Product;
};
const useEditProduct = ({ currentProduct }: Arguments) => {
  const [editingProduct, setEditingProduct] = useState<Product>(currentProduct);

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

  const handleStockUpdate = (productId: string, newStock: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, stock: newStock };
      setEditingProduct(updatedProduct);
    }
  };

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = (onEdit: (product: Product) => void) => {
    if (editingProduct) {
      onEdit(editingProduct);
    }
  };

  return {
    editingProduct,
    handlers: {
      handleEditProduct,
      handleProductNameUpdate,
      handlePriceUpdate,
      handleStockUpdate,
      handleEditComplete,
    },
  };
};

export { useEditProduct };
