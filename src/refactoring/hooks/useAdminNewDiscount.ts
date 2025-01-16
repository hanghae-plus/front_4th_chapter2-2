import { ChangeEvent, useState } from 'react';
import { Discount } from '../../types.ts';

const useAdminNewDiscount = () => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) =>
    setNewDiscount((prev) => ({
      ...prev,
      quantity: parseInt(e.target.value),
    }));

  const handleChangeRate = (e: ChangeEvent<HTMLInputElement>) =>
    setNewDiscount((prev) => ({
      ...prev,
      rate: parseInt(e.target.value) / 100,
    }));

  const resetNewDiscount = () => setNewDiscount({ quantity: 0, rate: 0 });

  return { newDiscount, handleChangeQuantity, handleChangeRate, resetNewDiscount };
};

export default useAdminNewDiscount;
