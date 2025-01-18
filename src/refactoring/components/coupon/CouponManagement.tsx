import { Coupon } from '@types';
import { Heading } from '../shared/Heading';
import { CouponList } from './CouponList';
import { CouponForm } from './CouponForm';

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
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        쿠폰 관리
      </Heading>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onCouponAdd={onCouponAdd} />
        <CouponList coupons={coupons} />
      </div>
    </div>
  );
}
