import { useState } from "react";
import { Discount } from "../../types";

export const useDiscounts = () => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const addDiscount = (discounts: Discount[], newDiscount: Discount) => {
    return [ ...discounts, newDiscount ];
  };

  const removeDiscount = (existingDiscounts: Discount[], index: number) => {
    const updatedDiscounts = [...existingDiscounts];
    updatedDiscounts.splice(index, 1);  // 해당 인덱스의 할인 삭제
    
    return updatedDiscounts;
  };

  return { newDiscount, setNewDiscount, addDiscount, removeDiscount };
};