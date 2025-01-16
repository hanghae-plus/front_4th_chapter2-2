import { useState } from 'react';
import { Discount } from '../../../../types.ts';

export const useDiscountForm = () => {
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const onChange = (key: 'quantity' | 'rate', value: number) => {
    setNewDiscount(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const reset = () => {
    setNewDiscount({
      quantity: 0,
      rate: 0,
    });
  };

  return { discountForm: newDiscount, onChange, reset };
};
