import { CouponForm } from './CouponForm';

import type { Coupon } from '../../../types';

interface CouponManagerProps {
  onCouponAdd: (newCoupon: Coupon) => void;
  coupons: Coupon[];
}

const CouponManager = ({ onCouponAdd, coupons }: CouponManagerProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onCouponAdd={onCouponAdd} />
        <div>
          <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
          <div className="space-y-2">
            {coupons.map((coupon, index) => (
              <div key={index} data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
                {coupon.name} ({coupon.code}):
                {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 할인
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponManager;
