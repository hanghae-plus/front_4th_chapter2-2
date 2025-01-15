import { SectionTitle } from '../../../shared/ui/typography';
import { CouponForm } from '../../../features/coupon/ui/CouponForm.tsx';
import { CouponList } from '../../../features/coupon/ui/CouponList.tsx';
import { ICoupon } from '../../../app/types';

interface CouponManagementProps {
  coupons: ICoupon[];
  onCouponAdd: (newCoupon: ICoupon) => void;
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
