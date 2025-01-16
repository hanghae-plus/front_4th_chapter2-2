import { Coupon } from '@types';
import { Heading } from '../shared/Heading';
import { CouponList } from './CouponList';
import { CouponForm } from './CouponForm';
import { useState } from 'react';

interface CouponManagementProps {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

export function CouponManagement({
  coupons,
  onCouponAdd,
}: CouponManagementProps) {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };
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
