import { CouponForm } from './CouponForm';
import { CreatedCouponList } from './CreatedCouponList';

import type { Coupon } from '../../../../../types';

interface CouponManagerProps {
  onCouponAdd: (newCoupon: Coupon) => void;
  coupons: Coupon[];
}

export const CouponManager = ({ onCouponAdd, coupons }: CouponManagerProps) => {
  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onCouponAdd={onCouponAdd} />
        <CreatedCouponList coupons={coupons} />
      </div>
    </>
  );
};
