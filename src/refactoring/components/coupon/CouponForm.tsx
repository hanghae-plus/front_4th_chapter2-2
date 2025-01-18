import { Coupon } from '@types';
import { Select } from '../shared/Select';
import { useState } from 'react';

interface CouponFormProps {
  onCouponAdd: (newCoupon: Coupon) => void;
}

const discountTypeOptions = [
  { value: 'amount', label: '금액(원)' },
  { value: 'percentage', label: '할인율(%)' },
];

export function CouponForm({ onCouponAdd }: CouponFormProps) {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleAddCoupon = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  const handleChangeDiscountType = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNewCoupon({
      ...newCoupon,
      discountType: event.target.value as 'amount' | 'percentage',
    });
  };

  return (
    <form className="space-y-2 mb-4" onSubmit={handleAddCoupon}>
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <Select
          options={discountTypeOptions}
          onChange={handleChangeDiscountType}
        />
        <input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={(e) =>
            setNewCoupon({
              ...newCoupon,
              discountValue: parseInt(e.target.value),
            })
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        쿠폰 추가
      </button>
    </form>
  );
}
