import { useState } from 'react';
import { Product } from 'src/types';

interface UseAdminProductProps {
  newProduct: Omit<Product, 'id'>;
  handleInputChange: (field: keyof Omit<Product, 'id'>, value: string | number) => void;
  handleAddNewProduct: () => void;
}

export const useAdminProduct = (
  productList: Product[],
  onProductAdd: (newProduct: Product) => void,
): UseAdminProductProps => {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleInputChange = (field: keyof Omit<Product, 'id'>, value: string | number) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: `p${productList.length + 1}` };
    onProductAdd(productWithId);
    setNewProduct({ name: '', price: 0, stock: 0, discounts: [] });
  };

  return { newProduct, handleInputChange, handleAddNewProduct };
};
