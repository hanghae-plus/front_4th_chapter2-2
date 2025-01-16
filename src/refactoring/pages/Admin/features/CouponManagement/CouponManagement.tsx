import { CouponAddForm } from '@/refactoring/pages/Admin/features/CouponManagement/components/CouponAddForm';
import { CouponInfo } from '@/refactoring/pages/Admin/features/CouponManagement/components/CouponInfo';
import type { Coupon } from '@/types';

interface CouponManagementProps {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponManagement = ({ coupons, onCouponAdd }: CouponManagementProps) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">쿠폰 관리</h2>
      <div className="rounded bg-white p-4 shadow">
        <CouponAddForm onCouponAdd={onCouponAdd} />

        <div>
          <h3 className="mb-2 text-lg font-semibold">현재 쿠폰 목록</h3>
          <div className="space-y-2">
            {coupons.map((coupon, index) => (
              <CouponInfo key={index} coupon={coupon} testId={`${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
