import { useState } from 'react';
import { Product } from '../../types';

interface NewProductProps {
  onProductAdd: (newProduct: Product) => void;
}

export const useNewProduct = ({ onProductAdd }: NewProductProps) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  const toggleNewProductForm = () => {
    setShowNewProductForm(!showNewProductForm);
  };

  const handleAddNewProductName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, name: e.target.value });
  };

  const handleAddNewProductPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, price: parseInt(e.target.value) });
  };

  const handleAddNewProductStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, stock: parseInt(e.target.value) });
  };

  return {
    showNewProductForm,
    newProduct,
    handleAddNewProduct,
    toggleNewProductForm,
    handleAddNewProductName,
    handleAddNewProductPrice,
    handleAddNewProductStock,
  };
};
