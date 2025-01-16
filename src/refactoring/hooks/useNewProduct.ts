import { ChangeEvent, useState } from 'react';
import { FormElementType, Product } from '../../types.ts';

interface UseNewProductProps {
  onProductAdd: (product: Product) => void;
}

const useNewProduct = ({ onProductAdd }: UseNewProductProps) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discountList: [],
  });

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discountList: [],
    });
    setShowNewProductForm(false);
  };

  const handleChangeProduct =
    <T extends keyof Omit<Product, 'id'>>(key: T) =>
    (e: ChangeEvent<FormElementType>) => {
      const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
      setNewProduct((prev) => ({
        ...prev,
        [key]: value as Product[T],
      }));
    };

  const toggleShowNewProductForm = () => setShowNewProductForm((prev) => !prev);

  return {
    showNewProductForm,
    newProduct,
    handleChangeProductName: handleChangeProduct('name'),
    handleChangeProductPrice: handleChangeProduct('price'),
    handleChangeProductStock: handleChangeProduct('stock'),
    toggleShowNewProductForm,
    handleAddNewProduct,
  };
};

export default useNewProduct;
