import { useState } from 'react';
import { Discount, Product } from '../../types';
import { INITIAL_DISCOUNT_STATE } from '../data/initialData';

interface UpdateFields {
  price?: number;
  name?: string;
  stock?: number;
}

export const useAdminEditingProduct = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState(INITIAL_DISCOUNT_STATE);

  // 상품 수정 시작 핸들러 함수
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // 상품 수정 핸들러 함수
  const handleFieldUpdate = (productId: string, fields: UpdateFields) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, ...fields };

      handleEditProduct(updatedProduct);
    }
  };

  // 할인 수정 핸들러 함수
  const handleEditDiscount = (newDiscount: Discount) => {
    setNewDiscount(newDiscount);
  };

  // 할인 초기화 핸들러 함수
  const handleClearDiscount = () => {
    setNewDiscount(INITIAL_DISCOUNT_STATE);
  };

  // 상품 초기화 핸들러 함수
  const handleClearProduct = () => {
    setEditingProduct(null);
  };

  return {
    editingProduct,
    newDiscount,
    handleEditProduct,
    handleFieldUpdate,
    handleEditDiscount,
    handleClearProduct,
    handleClearDiscount,
  };
};
