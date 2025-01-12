import { useState } from "react";
import { Discount, Product } from "../../types";
import { ValueOf } from "next/dist/shared/lib/constants";

export const useEditingProduct = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const getEditingProduct = (productId: string): Product | null =>
    editingProduct?.id === productId ? editingProduct : null;

  // 계산(순수함수) 추출
  const getUpdatedProduct = <K extends keyof Product>(
    product: Product,
    key: K,
    newValue: Product[K],
  ): Product => {
    return { ...product, [key]: newValue };
  };

  // 액션 공통화
  const updateProduct = (
    productId: string,
    key: keyof Product,
    newValue: ValueOf<Product>,
  ) => {
    const product = getEditingProduct(productId);
    if (!product) return;
    const updatedProduct = getUpdatedProduct(product, key, newValue);
    setEditingProduct(updatedProduct);
  };

  const handleProductNameUpdate = (productId: string, newName: string) =>
    updateProduct(productId, "name", newName);

  const handlePriceUpdate = (productId: string, newPrice: number) =>
    updateProduct(productId, "price", newPrice);

  const handleStockUpdate = (productId: string, newStock: number) =>
    updateProduct(productId, "stock", newStock);

  const handleAddDiscount = (productId: string, newDiscount: Discount) => {
    const prevDiscounts = getEditingProduct(productId)?.discounts;
    if (!prevDiscounts) return;

    updateProduct(productId, "discounts", [...prevDiscounts, newDiscount]);
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const prevDiscounts = getEditingProduct(productId)?.discounts;
    if (!prevDiscounts) return;

    updateProduct(
      productId,
      "discounts",
      prevDiscounts.filter((_, i) => i !== index),
    );
  };

  const clearEditingProduct = () => {
    setEditingProduct(null);
  };

  return {
    editingProduct,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    clearEditingProduct,
  };
};
