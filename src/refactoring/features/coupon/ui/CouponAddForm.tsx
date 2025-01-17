// CouponAddForm.tsx
import { useState } from 'react';
import { TextButton, FormInput, FormSelect } from '../../../shared/ui';
import { Coupon } from '../../../../types';

interface CouponAddFormProps {
  onSubmit: (coupon: Coupon) => void;
  className?: string;
}

const initialCouponState: Coupon = {
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0,
};

const discountOptions = [
  { value: 'amount', label: '금액(원)' },
  { value: 'percentage', label: '할인율(%)' },
];

export function CouponAddForm({ onSubmit, className = '' }: CouponAddFormProps) {
  const [newCoupon, setNewCoupon] = useState<Coupon>(initialCouponState);

  const handleSubmit = () => {
    onSubmit(newCoupon);
    setNewCoupon(initialCouponState);
  };

  return (
    <div className={className}>
      <div className="space-y-2">
        <FormInput
          id="coupon-name-input"
          label={null}
          type="text"
          placeholder="쿠폰 이름"
          value={newCoupon.name}
          onChange={(value) => setNewCoupon({ ...newCoupon, name: value })}
        />
        <FormInput
          id="coupon-code-input"
          label={null}
          type="text"
          placeholder="쿠폰 코드"
          value={newCoupon.code}
          onChange={(value) => setNewCoupon({ ...newCoupon, code: value })}
        />
        <div className="flex gap-2">
          <FormSelect
            className="w-full"
            id="discount-type-select"
            value={newCoupon.discountType}
            onChange={(value) =>
              setNewCoupon({
                ...newCoupon,
                discountType: value as 'amount' | 'percentage',
              })
            }
            options={discountOptions}
          />
          <FormInput
            id="discount-value-input"
            label={null}
            className="w-full"
            type="number"
            placeholder="할인 값"
            value={newCoupon.discountValue}
            onChange={(value) =>
              setNewCoupon({
                ...newCoupon,
                discountValue: parseInt(value, 10),
              })
            }
          />
        </div>
        <TextButton variant="complete" title="쿠폰 추가" onClick={handleSubmit} fullWidth />
      </div>
    </div>
  );
}
