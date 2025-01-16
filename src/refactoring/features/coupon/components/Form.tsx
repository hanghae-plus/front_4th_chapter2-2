import { useState } from 'react';
import { Coupon, DiscountType } from '../../../../types';
import { validateCoupon } from '../helpers';

interface CouponFormProps {
  onSubmit: (coupon: Coupon) => void;
}

export const CouponForm = ({ onSubmit }: CouponFormProps) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const validation = validateCoupon(newCoupon);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    onSubmit(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
    setValidationErrors([]);
  };

  const handleChange = <K extends keyof Coupon>(key: K, value: Coupon[K]) => {
    setNewCoupon((prev) => ({ ...prev, [key]: value }));
    setValidationErrors([]);
  };

  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={(e) => handleChange('name', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={(e) => handleChange('code', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <select
          value={newCoupon.discountType}
          onChange={(e) => handleChange('discountType', e.target.value as DiscountType)}
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={(e) => handleChange('discountValue', parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <button onClick={handleSubmit} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        쿠폰 추가
      </button>
      {validationErrors.length > 0 && (
        <div className="mt-2 text-red-500 text-sm">
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};
