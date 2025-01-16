import { useState } from 'react';
import { Product } from '../../types';
import { updateKey } from '../utils';
import { useProduct } from './useProduct';

export const useProductEdit = (onProductUpdate: ReturnType<typeof useProduct>['updateProduct']) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const updateProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // 상품 특정 속성 업데이트 함수 추가
  const updateProductWith = (
    id: string,
    attributeName: keyof Omit<Product, 'id'>,
    attribute: Product[keyof Omit<Product, 'id'>],
  ) => {
    if (editingProduct && editingProduct.id === id) {
      const updatedProduct = updateKey(editingProduct, attributeName, attribute);
      setEditingProduct(updatedProduct);
    }
  };

  const completeEditing = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  return {
    editingProduct,
    setEditingProduct,
    updateProduct,
    updateProductWith,
    completeEditing,
  };
};
