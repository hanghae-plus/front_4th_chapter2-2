import { useState } from 'react';
import { Discount } from '../models/types/Discount';
import { Product } from '../models/types/Product';

interface Arguments {
  products: Product[];
  updateProduct: (product: Product) => void;
}

const useOthers = ({ products, updateProduct }: Arguments) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

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
      updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const product = { ...updatedProduct, stock: newStock };
      updateProduct(product);
      setEditingProduct(product);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const product = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      updateProduct(product);
      setEditingProduct(product);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const product = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      updateProduct(product);
      setEditingProduct(product);
    }
  };

  const handleUpdateNewDiscountQuantity = (quantity: number) => {
    setNewDiscount((prev) => ({ ...prev, quantity }));
  };

  const handleUpdateNewDiscountRate = (rate: number) => {
    setNewDiscount((prev) => ({ ...prev, rate }));
  };

  return {
    editingProduct,
    newDiscount,
    handlers: {
      handleEditProduct,
      handleProductNameUpdate,
      handlePriceUpdate,
      handleEditComplete,
      handleStockUpdate,
      handleAddDiscount,
      handleRemoveDiscount,
      handleUpdateNewDiscountQuantity,
      handleUpdateNewDiscountRate,
    },
  };
};

export { useOthers };
