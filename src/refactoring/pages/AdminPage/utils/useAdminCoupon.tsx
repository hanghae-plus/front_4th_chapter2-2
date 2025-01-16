// src/app/hooks/useAdminCoupons.ts
import { useState } from 'react';
import { Coupon } from '@/shared/types';
import { useCouponStore } from '@/entities/coupon';

export function useAdminCoupons() {
  const { coupons, handleCouponAdd } = useCouponStore();

  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  // 새로운 쿠폰 추가
  const handleAddCoupon = () => {
    handleCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  return {
    coupons,
    newCoupon,
    setNewCoupon,
    handleAddCoupon,
  };
}
