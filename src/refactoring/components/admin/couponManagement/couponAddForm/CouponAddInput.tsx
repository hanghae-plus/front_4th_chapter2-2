import { Coupon } from '../../../../../types';
import Input from '../../../atoms/Input';

export interface CouponAddInputProps {
  newCoupon: Coupon;
  handleNewCoupon: (coupon: Coupon) => void;
}

export const CouponAddInput = ({ newCoupon, handleNewCoupon }: CouponAddInputProps) => {
  return (
    <>
      <Input
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={value => handleNewCoupon({ ...newCoupon, name: value.toString() })}
      />
      <Input
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={value => handleNewCoupon({ ...newCoupon, code: value.toString() })}
      />
      <div className="flex gap-2">
        <select
          value={newCoupon.discountType}
          onChange={e =>
            handleNewCoupon({
              ...newCoupon,
              discountType: e.target.value as 'amount' | 'percentage'
            })
          }
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <Input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={value => {
            handleNewCoupon({
              ...newCoupon,
              discountValue: typeof value === 'string' ? parseInt(value) : value
            });
          }}
        />
      </div>{' '}
    </>
  );
};
