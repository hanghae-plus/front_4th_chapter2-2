import { Coupon } from '../../../../types';
import { CouponDisplay } from '../../../entities/coupon/ui/CouponDisplay';

interface CouponListProps {
  coupons: Coupon[];
}

export function CouponList({ coupons }: CouponListProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
      <div className="space-y-2">
        {coupons.map((coupon, index) => {
          const key = `${index}-${coupon.name}`;
          return <CouponDisplay key={key} coupon={coupon} index={index} />;
        })}
      </div>
    </div>
  );
}
