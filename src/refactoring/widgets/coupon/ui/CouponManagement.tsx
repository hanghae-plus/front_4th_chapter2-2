import { Coupon } from '../../../../types.ts';
import { SectionTitle } from '../../../shared/ui/typography';
import { CouponForm } from '../../../features/coupon/ui/CouponForm.tsx';
import { CouponList } from '../../../features/coupon/ui/CouponList.tsx';

interface CouponManagementProps {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

export function CouponManagement({
  coupons,
  onCouponAdd,
}: CouponManagementProps) {
  return (
    <div>
      <SectionTitle title={'쿠폰 관리'} />
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onCouponAdd={onCouponAdd} />
      </div>
      <CouponList coupons={coupons} />
    </div>
  );
}
