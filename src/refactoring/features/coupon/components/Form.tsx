import type { Coupon, DiscountType } from '../../../../types';
import { useForm } from '../../../hooks/useForm';
import { validateCoupon } from '../helpers';

interface CouponFormProps {
  onSubmit: (coupon: Coupon) => void;
}

export const CouponForm = ({ onSubmit }: CouponFormProps) => {
  const { values, errors, handleChange, handleSubmit } = useForm<Coupon>({
    initialValues: {
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    },
    validate: validateCoupon,
    onSubmit,
  });

  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={values.name}
        onChange={(e) => handleChange('name', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={values.code}
        onChange={(e) => handleChange('code', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <select
          value={values.discountType}
          onChange={(e) => handleChange('discountType', e.target.value as DiscountType)}
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <input
          type="number"
          placeholder="할인 값"
          value={values.discountValue}
          onChange={(e) => handleChange('discountValue', parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <button onClick={handleSubmit} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        쿠폰 추가
      </button>
      {errors.length > 0 && (
        <div className="mt-2 text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};
