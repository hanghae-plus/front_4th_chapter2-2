import { useState } from 'react';
import { Product } from '../../types';
import { useProduct } from './useProduct';

export const useProductEdit = (
  onProductUpdate: ReturnType<typeof useProduct>['updateProduct'],
  productList: Product[],
) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // handleEditProduct 함수 수정
  const updateProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // 새로운 핸들러 함수 추가
  const updateProductName = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const updatePrice = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  // 수정 완료 핸들러 함수 추가
  const completeEditing = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  const updateStock = (productId: string, newStock: number) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  return {
    editingProduct,
    setEditingProduct,
    updateProduct,
    updateProductName,
    updatePrice,
    updateStock,
    completeEditing,
  };
};
