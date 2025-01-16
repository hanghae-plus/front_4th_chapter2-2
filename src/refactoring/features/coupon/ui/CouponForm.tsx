import { useState } from 'react';
import { ICoupon } from '../../../shared/types';
import { Input, Select } from '../../../shared/ui/inputs';

interface CouponFormProps {
  onCouponAdd: (newCoupon: ICoupon) => void;
}

export function CouponForm({ onCouponAdd }: CouponFormProps) {
  const [newCoupon, setNewCoupon] = useState<ICoupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  return (
    <div className="space-y-2 mb-4">
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
          value={newCoupon.discountType}
          onChange={(e) =>
            setNewCoupon({
              ...newCoupon,
              discountType: e.target.value as 'amount' | 'percentage',
            })
          }
          options={[
            { value: 'amount', text: '금액(원)' },
            { value: 'percentage', text: '할인율(%)' },
          ]}
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
      <button
        onClick={handleAddCoupon}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        쿠폰 추가
      </button>
    </div>
  );
}
