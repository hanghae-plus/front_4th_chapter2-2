import { useState } from 'react';

import type { Coupon } from '@/types';

interface CouponAddFormProps {
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponAddForm = ({ onCouponAdd }: CouponAddFormProps) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0
  });

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0
    });
  };

  return (
    <div className="mb-4 space-y-2">
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={e => setNewCoupon({ ...newCoupon, name: e.target.value })}
        className="w-full rounded border p-2"
      />
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
        className="w-full rounded border p-2"
      />

      <div className="flex gap-2">
        <select
          value={newCoupon.discountType}
          onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value as 'amount' | 'percentage' })}
          className="w-full rounded border p-2"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={e => setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) })}
          className="w-full rounded border p-2"
        />
      </div>

      <button onClick={handleAddCoupon} className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600">
        쿠폰 추가
      </button>
    </div>
  );
};
