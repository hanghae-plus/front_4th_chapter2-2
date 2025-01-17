import { SectionTitle } from '../../../shared/ui/typography';
import { CouponForm } from '../../../features/coupon/ui/CouponForm.tsx';
import { CouponList } from '../../../features/coupon/ui/CouponList.tsx';
import { useCouponContext } from '../../../entities/coupon/model';

export function CouponManagement() {
  const { coupons, addCoupon } = useCouponContext();
  return (
    <div>
      <SectionTitle title={'쿠폰 관리'} />
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onCouponAdd={addCoupon} />
      </div>
      <CouponList coupons={coupons} />
    </div>
  );
}
