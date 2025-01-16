import type { Coupon } from '@/types';

interface CouponInfoProps {
  coupon: Coupon;
  testId: string;
}

export const CouponInfo = ({ coupon, testId }: CouponInfoProps) => {
  return (
    <div className="space-y-2">
      <div data-testid={`coupon-${testId}`} className="rounded bg-gray-100 p-2">
        {coupon.name} ({coupon.code}):
        {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 할인
      </div>
    </div>
  );
};
