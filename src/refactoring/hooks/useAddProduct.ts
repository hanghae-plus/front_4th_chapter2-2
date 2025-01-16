import { useState } from 'react';
import { initializeNewProduct } from '../entities/product/model/initializeNewProduct';
import { getUniqueId } from '../pages/shared/lib/getUniqueId';
import { Product } from '../shared/types/types';

interface UseAddProductProps {
  addProduct: (product: Product) => void;
}

export const useAddProduct = ({ addProduct }: UseAddProductProps) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(
    initializeNewProduct(),
  );

  const handleAddNewProduct = () => {
    const productWithId: Product = { ...newProduct, id: getUniqueId() };
    addProduct(productWithId);
    resetForm();
  };

  const resetForm = () => {
    setNewProduct(initializeNewProduct());
    setShowNewProductForm(false);
  };

  return {
    newProduct,
    showNewProductForm,
    setShowNewProductForm,
    setNewProduct,
    handleAddNewProduct,
    resetForm,
  };
};
