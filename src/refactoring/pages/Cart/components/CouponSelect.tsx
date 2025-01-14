import type { Coupon } from '@/types';

type CouponSelectProps = {
  coupons: Coupon[];
  onCouponApply: (coupon: Coupon) => void;
};

export const CouponSelect = ({ coupons, onCouponApply }: CouponSelectProps) => {
  return (
    <select onChange={e => onCouponApply(coupons[parseInt(e.target.value)])} className="mb-2 w-full rounded border p-2">
      <option value="">쿠폰 선택</option>
      {coupons.map((coupon, index) => (
        <option key={coupon.code} value={index}>
          {coupon.name} - {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
        </option>
      ))}
    </select>
  );
};
