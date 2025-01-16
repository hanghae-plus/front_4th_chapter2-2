import { Coupon } from '@types';
import { Heading } from '../shared/Heading';
import { CouponList } from './CouponList';
import { CouponForm } from './CouponForm';

interface CouponManagementProps {
  coupons: Coupon[];
  newCoupon: Coupon;
  setNewCoupon: React.Dispatch<React.SetStateAction<Coupon>>;
  handleAddCoupon: (event: React.FormEvent) => void;
}

export function CouponManagement({
  coupons,
  newCoupon,
  setNewCoupon,
  handleAddCoupon,
}: CouponManagementProps) {
  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        쿠폰 관리
      </Heading>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm
          newCoupon={newCoupon}
          setNewCoupon={setNewCoupon}
          onSubmit={handleAddCoupon}
        />
        <CouponList coupons={coupons} />
      </div>
    </div>
  );
}
