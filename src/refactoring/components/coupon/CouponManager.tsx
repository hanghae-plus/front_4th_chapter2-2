import { CouponForm } from './CouponForm';
import { CreatedCouponList } from './CreatedCouponList';

import type { Coupon } from '../../../types';

interface CouponManagerProps {
  onCouponAdd: (newCoupon: Coupon) => void;
  coupons: Coupon[];
}

export const CouponManager = ({ onCouponAdd, coupons }: CouponManagerProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onCouponAdd={onCouponAdd} />
        <CreatedCouponList coupons={coupons} />
      </div>
    </div>
  );
};
