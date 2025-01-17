import { useState } from 'react';
import { Discount, Product } from '../../types';

interface AdminProductListProps {
  onProductUpdate: (updatedProduct: Product) => void;
  productList: Product[];
}

export const useAdminProductList = ({ onProductUpdate, productList }: AdminProductListProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleChangeNewDiscountQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiscount((prev) => ({ ...prev, quantity: parseInt(e.target.value) }));
  };

  const handleChangeNewDiscountRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiscount({
      ...newDiscount,
      rate: parseInt(e.target.value) / 100,
    });
  };

  return {
    editingProduct,
    newDiscount,
    handleEditProduct,
    handleEditComplete,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleChangeNewDiscountQuantity,
    handleChangeNewDiscountRate,
  };
};
