import { useState } from 'react';
import { Discount } from '../../../../types';

interface UseDiscountEditorProps {
  initialDiscounts: Discount[];
  onUpdate?: (discounts: Discount[]) => void;
}

export const useDiscountEditor = ({ initialDiscounts, onUpdate }: UseDiscountEditorProps) => {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);

  // 할인 정보 목록에 할인 추가
  const handleAddDiscount = (newDiscount: Discount) => {
    const isDuplicate = discounts.some((discount) => discount.quantity === newDiscount.quantity);

    if (isDuplicate) {
      return;
    }

    const updatedDiscounts = [...discounts, newDiscount];

    if (onUpdate) {
      onUpdate(updatedDiscounts);
    }

    setDiscounts(updatedDiscounts);
  };

  // 할인 정보 목록에서 특정 할인 제거
  const handleRemoveDiscount = (index: number) => {
    const updatedDiscounts = discounts.filter((_, i) => i !== index);

    if (onUpdate) {
      onUpdate(updatedDiscounts);
    }

    setDiscounts(updatedDiscounts);
  };

  return {
    discounts,
    handleAddDiscount,
    handleRemoveDiscount,
  };
};
