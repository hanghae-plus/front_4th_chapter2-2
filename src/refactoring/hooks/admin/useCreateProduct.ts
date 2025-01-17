import { useState } from 'react';
import { Product } from '../../models/types/Product';

interface Arguments {
  addProduct: (product: Product) => void;
}

const useCreateProduct = ({ addProduct }: Arguments) => {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    addProduct(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
  };

  const handleUpdateNewProductName = (name: string) => {
    setNewProduct((prev) => ({ ...prev, name }));
  };

  const handleUpdateNewProductPrice = (price: number) => {
    setNewProduct((prev) => ({ ...prev, price }));
  };

  const handleUpdateNewProductStock = (stock: number) => {
    setNewProduct((prev) => ({ ...prev, stock }));
  };

  return {
    newProduct,
    handlers: {
      handleAddNewProduct,
      handleUpdateNewProductName,
      handleUpdateNewProductPrice,
      handleUpdateNewProductStock,
    },
  };
};

export { useCreateProduct };
