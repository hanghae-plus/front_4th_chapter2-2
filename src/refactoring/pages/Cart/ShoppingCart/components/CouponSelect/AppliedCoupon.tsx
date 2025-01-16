import type { Coupon } from '@/types';

type AppliedCouponProps = {
  appliedCoupon: Coupon;
};

export const AppliedCoupon = ({ appliedCoupon }: AppliedCouponProps) => {
  return (
    <p className="text-green-600">
      적용된 쿠폰: {appliedCoupon.name}(
      {appliedCoupon.discountType === 'amount' ? `${appliedCoupon.discountValue}원` : `${appliedCoupon.discountValue}%`}{' '}
      할인)
    </p>
  );
};
