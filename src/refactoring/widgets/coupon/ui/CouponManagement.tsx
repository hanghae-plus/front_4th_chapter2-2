import { CouponAddForm } from '../../../features/coupon/ui/CouponAddForm';
import { CouponList } from './CouponList';
import { useCouponContext } from '../../../entities/coupon/model/useCouponContext';

export function CouponManagement() {
  const { coupons, addCoupon } = useCouponContext();
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow space-y-4">
        <CouponAddForm onSubmit={addCoupon} />
        <CouponList coupons={coupons} />
      </div>
    </div>
  );
}
