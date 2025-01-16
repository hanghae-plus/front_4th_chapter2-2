import { useState } from 'react';
import { Product } from '../../types';

export const useProductsManagement = (
  initialProducts: Product[],
  onProductUpdate: (product: Product) => void,
  onProductAdd: (product: Product) => void,
) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleProductNameUpdate = (productId: string, newName: string) => {
    const updatedProduct = initialProducts.find((p) => p.id === productId);
    if (updatedProduct) {
      const updated = { ...updatedProduct, name: newName };
      onProductUpdate(updated);
    }
  };

  const handleProductPriceUpdate = (productId: string, newPrice: number) => {
    const updatedProduct = initialProducts.find((p) => p.id === productId);
    if (updatedProduct) {
      const updated = { ...updatedProduct, price: newPrice };
      onProductUpdate(updated);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = initialProducts.find((p) => p.id === productId);
    if (updatedProduct) {
      const updated = { ...updatedProduct, stock: newStock };
      onProductUpdate(updated);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      const productToAdd = {
        ...newProduct,
        id: crypto.randomUUID(),
        discounts: [],
      };
      onProductAdd(productToAdd);
      setNewProduct({
        id: '',
        name: '',
        price: 0,
        stock: 0,
        discounts: [],
      });
      setShowNewProductForm(false);
    }
  };

  return {
    openProductIds,
    newProduct,
    showNewProductForm,
    setNewProduct,
    setShowNewProductForm,
    toggleProductAccordion,
    handleProductNameUpdate,
    handleProductPriceUpdate,
    handleStockUpdate,
    handleAddProduct,
  };
};
