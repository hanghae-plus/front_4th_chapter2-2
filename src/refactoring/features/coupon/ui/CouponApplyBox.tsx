import { Coupon } from '../../../../types';
import { FormSelect } from '../../../shared/ui';
import { createCouponOptions } from '../lib/createCouponOptions';
import { useCouponContext } from '../../../entities/coupon/model/useCouponContext';

interface CouponApplyBoxProps {
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
}

export function CouponApplyBox({ selectedCoupon, applyCoupon }: CouponApplyBoxProps) {
  const { coupons } = useCouponContext();

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
      <FormSelect
        value={selectedCoupon?.name ?? ''}
        onChange={(value) => applyCoupon(coupons[parseInt(value, 10)])}
        options={createCouponOptions(coupons)}
        placeholder="쿠폰 선택"
        className="mb-2"
      />
      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}(
          {selectedCoupon.discountType === 'amount'
            ? `${selectedCoupon.discountValue}원`
            : `${selectedCoupon.discountValue}%`}{' '}
          할인)
        </p>
      )}
    </div>
  );
}
