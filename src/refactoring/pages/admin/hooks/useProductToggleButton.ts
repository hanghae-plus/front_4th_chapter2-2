import { useState } from "react";
import { Discount, Product } from "../../../../types";

export const useProductToggleButton = (products: Product[], onProductUpdate: (updatedProduct: Product) => void) => {
    const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newDiscount, setNewDiscount] = useState<Discount>({
      quantity: 0,
      rate: 0,
    });
  
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
  
    const handleEditProduct = (product: Product) => {
      setEditingProduct({ ...product });
    };
  
    const updateProductField = (field: keyof Product, value: any) => {
      if (editingProduct) {
        setEditingProduct({ ...editingProduct, [field]: value });
      }
    };
  
    const handleEditComplete = () => {
      if (editingProduct) {
        onProductUpdate(editingProduct);
        setEditingProduct(null);
      }
    };
  
    const handleAddDiscount = (productId: string) => {
      const updatedProduct = products.find((p) => p.id === productId);
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
  
    const handleRemoveDiscount = (productId: string, index: number) => {
      const updatedProduct = products.find((p) => p.id === productId);
      if (updatedProduct) {
        const newProduct = {
          ...updatedProduct,
          discounts: updatedProduct.discounts.filter((_, i) => i !== index),
        };
        onProductUpdate(newProduct);
        setEditingProduct(newProduct);
      }
    };
  
    return {
      openProductIds,
      editingProduct,
      newDiscount,
      setNewDiscount,
      toggleProductAccordion,
      handleEditProduct,
      updateProductField,
      handleEditComplete,
      handleAddDiscount,
      handleRemoveDiscount,
    };
  };