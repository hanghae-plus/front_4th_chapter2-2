import { useState } from "react";
import { Product, Discount } from "../../../../types";
import { INITIAL_DISCOUNT } from "../../../constants/initialData";

export const useDiscountManager = (
  onProductUpdate: (updatedProduct: Product) => void
) => {
  const [newDiscount, setNewDiscount] = useState<Discount>(INITIAL_DISCOUNT);

  const handleAddDiscount = (product: Product) => {
    const updatedProduct = {
      ...product,
      discounts: [...product.discounts, newDiscount],
    };
    onProductUpdate(updatedProduct);
    setNewDiscount(INITIAL_DISCOUNT);
    return updatedProduct;
  };

  const handleRemoveDiscount = (product: Product, index: number) => {
    const updatedDiscounts = product.discounts.filter((_, i) => i !== index);
    const updatedProduct = { ...product, discounts: updatedDiscounts };
    onProductUpdate(updatedProduct);
    return updatedProduct;
  };

  const handleDiscountChange = (field: keyof Discount, value: number) => {
    setNewDiscount((prev) => ({
      ...prev,
      [field]: field === "rate" ? value / 100 : value,
    }));
  };

  return {
    newDiscount,
    handleAddDiscount,
    handleRemoveDiscount,
    handleDiscountChange,
  };
};
