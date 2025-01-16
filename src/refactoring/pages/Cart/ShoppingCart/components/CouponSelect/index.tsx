import { AppliedCoupon } from '@/refactoring/pages/Cart/ShoppingCart/components/CouponSelect/AppliedCoupon';
import type { Coupon } from '@/types';

type CouponSelectProps = {
  selectedCoupon: Coupon | null;
  coupons: Coupon[];
  onCouponApply: (coupon: Coupon) => void;
};

export const CouponSelect = ({ selectedCoupon, coupons, onCouponApply }: CouponSelectProps) => {
  return (
    <>
      <select
        value={selectedCoupon?.code ?? ''}
        onChange={e => onCouponApply(coupons.find(coupon => coupon.code === e.target.value)!)}
        className="mb-2 w-full rounded border p-2"
      >
        <option value="">쿠폰 선택</option>
        {coupons.map(coupon => (
          <option key={coupon.code} value={coupon.code}>
            {coupon.name} -{' '}
            {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
          </option>
        ))}
      </select>

      {selectedCoupon && <AppliedCoupon appliedCoupon={selectedCoupon} />}
    </>
  );
};
