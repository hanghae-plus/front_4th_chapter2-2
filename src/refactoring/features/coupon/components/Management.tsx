import type { Coupon } from '../../../../types';
import { CouponItem } from './Item';
import { CouponForm } from './Form';

interface CouponManagementProps {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponManagement = ({ coupons, onCouponAdd }: CouponManagementProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onSubmit={onCouponAdd} />
        <div>
          <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
          <div className="space-y-2">
            {coupons.map((coupon, index) => (
              <CouponItem key={index} coupon={coupon} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
