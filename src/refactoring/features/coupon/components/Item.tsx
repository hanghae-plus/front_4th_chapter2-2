import { Coupon } from '../../../../types';
import { formatCouponDiscount } from '../../product/helpers';

interface CouponItemProps {
  coupon: Coupon;
  index: number;
}

export const CouponItem = ({ coupon, index }: CouponItemProps) => {
  return (
    <div data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
      {coupon.name} ({coupon.code}):
      {formatCouponDiscount(coupon)} 할인
    </div>
  );
};
