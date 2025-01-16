import { useState } from 'react';
import { IDiscount } from '../../../shared/types';

export const useDiscounts = (initialDiscounts: IDiscount[]) => {
  const [discounts, setDiscounts] = useState<IDiscount[]>(initialDiscounts);
  const [newDiscount, setNewDiscount] = useState<IDiscount>({
    quantity: 0,
    rate: 0,
  });

  const handleAddDiscount = () => {
    setNewDiscount({ quantity: 0, rate: 0 });
    setDiscounts((prev) => [...prev, newDiscount]);
  };

  const handleRemoveDiscount = (index: number) => {
    setDiscounts((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    discounts,
    newDiscount,
    setNewDiscount,
    handleAddDiscount,
    handleRemoveDiscount,
  };
};
