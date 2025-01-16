import { useState } from 'react';
import { Coupon } from '@advanced/entities/coupon';
import { Input, Select } from '@advanced/shared/ui';
import { useAddCouponMutation } from '../model';

const discountTypeOptions = [
  { value: 'amount', label: '금액(원)' },
  { value: 'percentage', label: '할인율(%)' },
];

export function CouponForm() {
  const { mutate: addCoupon } = useAddCouponMutation();
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleAddCoupon = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addCoupon(newCoupon);
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
      <Input
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
      />
      <Input
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
      />
      <div className="flex gap-2">
        <Select
          options={discountTypeOptions}
          onChange={handleChangeDiscountType}
        />
        <Input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={(e) =>
            setNewCoupon({
              ...newCoupon,
              discountValue: parseInt(e.target.value),
            })
          }
        />
      </div>
      <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        쿠폰 추가
      </button>
    </form>
  );
}
