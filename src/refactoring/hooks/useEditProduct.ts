import { useState } from 'react';
import { Product } from '../shared/types/types';

interface UseEditProductProps {
  products: Product[];
  updateProduct: (product: Product) => void;
}

export const useEditProduct = ({ updateProduct }: UseEditProductProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 수정할 상품 선택 핸들러 함수
  const selectEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  //상품 수정 핸들러 함수
  const updateEditingProduct = (form: Product) => {
    if (editingProduct && editingProduct.id === form.id) {
      const updatedProduct = { ...form };
      updateProduct(updatedProduct);
    }
  };

  const resetEditingProduct = () => {
    setEditingProduct(null);
  };

  return {
    editingProduct,
    updateEditingProduct,
    selectEditProduct,
    resetEditingProduct,
  };
};
