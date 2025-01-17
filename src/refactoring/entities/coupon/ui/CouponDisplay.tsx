import { Coupon } from '../../../../types';

interface CouponDisplayProps {
  coupon: Coupon;
  index: number;
}

export function CouponDisplay({ coupon, index }: CouponDisplayProps) {
  const key = `${index}-${coupon.name}`;

  return (
    <div key={key} data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
      {coupon.name} ({coupon.code}):
      {coupon.discountType === 'amount'
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`}{' '}
      할인
    </div>
  );
}
