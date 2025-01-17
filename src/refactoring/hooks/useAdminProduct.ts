import { useState } from 'react';
import { Product } from 'src/types';
import { initializeNewProduct } from '../models/admin';

interface UseAdminProductProps {
  newProduct: Omit<Product, 'id'>;
  handleInputChange: (field: keyof Omit<Product, 'id'>, value: string | number) => void;
  handleAddNewProduct: () => void;
}

export const useAdminProduct = (
  productList: Product[],
  onProductAdd: (newProduct: Product) => void,
): UseAdminProductProps => {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(initializeNewProduct());

  const handleInputChange = (field: keyof Omit<Product, 'id'>, value: string | number) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: `p${productList.length + 1}` };
    onProductAdd(productWithId);
    setNewProduct(initializeNewProduct());
  };

  return { newProduct, handleInputChange, handleAddNewProduct };
};
