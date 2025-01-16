import { useState } from 'react';

import type { Discount } from '@/types';

interface DiscountDetailsProps {
  discounts: Discount[];
  onDiscountsUpdate: (newDiscounts: Discount[]) => void;
}

export const DiscountDetails = ({ discounts, onDiscountsUpdate }: DiscountDetailsProps) => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const handleAddDiscount = () => {
    onDiscountsUpdate([...discounts, newDiscount]);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const handleRemoveDiscount = (index: number) => {
    onDiscountsUpdate(discounts.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h4 className="mb-2 text-lg font-semibold">할인 정보</h4>
      {discounts.map((discount, index) => (
        <div key={index} className="mb-2 flex items-center justify-between">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
          <button
            onClick={() => handleRemoveDiscount(index)}
            className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      ))}
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="수량"
          value={newDiscount.quantity}
          onChange={e => setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })}
          className="w-1/3 rounded border p-2"
        />
        <input
          type="number"
          placeholder="할인율 (%)"
          value={newDiscount.rate * 100}
          onChange={e => setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })}
          className="w-1/3 rounded border p-2"
        />
        <button onClick={handleAddDiscount} className="w-1/3 rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
          할인 추가
        </button>
      </div>
    </div>
  );
};
