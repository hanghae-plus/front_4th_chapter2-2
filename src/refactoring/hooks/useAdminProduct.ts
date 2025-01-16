import { useState } from 'react';
import { Product } from '../../types';
import { INITIAL_PRODUCT_STATE } from '../data/initialData';
import { addNewProduct } from '../models';

interface Props {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onAddSuccess?: () => void;
}

export const useAdminProduct = ({ onProductAdd, onAddSuccess }: Props) => {
  const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT_STATE);

  const handleAddNewProduct = () => {
    const productWithId = addNewProduct(newProduct);

    onProductAdd(productWithId);
    setNewProduct(INITIAL_PRODUCT_STATE);
    onAddSuccess?.();
  };

  return {
    newProduct,
    setNewProduct,
    handleAddNewProduct,
  };
};
