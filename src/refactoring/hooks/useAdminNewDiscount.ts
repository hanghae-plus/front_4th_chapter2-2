import { ChangeEvent, useState } from 'react';
import { Discount } from '../../types.ts';
import { initialNewDiscount } from '../../constant.ts';

const useAdminNewDiscount = () => {
  const [newDiscount, setNewDiscount] = useState<Discount>(initialNewDiscount);

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

  const resetNewDiscount = () => setNewDiscount(initialNewDiscount);

  return { newDiscount, handleChangeQuantity, handleChangeRate, resetNewDiscount };
};

export default useAdminNewDiscount;
