import { useState } from 'react';
import { Discount } from '../../models/types/Discount';
import { Product } from '../../models/types/Product';

interface Arguments {
  products: Product[];
  updateProduct: (product: Product) => void;
  updateEditingProduct: (product: Product) => void;
}

const useDiscount = ({
  products,
  updateProduct,
  updateEditingProduct,
}: Arguments) => {
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);

    if (updatedProduct) {
      const product = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      updateProduct(product);
      updateEditingProduct(product);
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
      updateEditingProduct(product);
    }
  };

  const handleUpdateNewDiscountQuantity = (quantity: number) => {
    setNewDiscount((prev) => ({ ...prev, quantity }));
  };

  const handleUpdateNewDiscountRate = (rate: number) => {
    setNewDiscount((prev) => ({ ...prev, rate }));
  };

  return {
    newDiscount,
    handlers: {
      handleAddDiscount,
      handleRemoveDiscount,
      handleUpdateNewDiscountQuantity,
      handleUpdateNewDiscountRate,
    },
  };
};

export { useDiscount };
