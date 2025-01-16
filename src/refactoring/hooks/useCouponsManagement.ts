import { useState } from 'react';
import { Coupon } from '../../types';

export const useCouponsManagement = (onCouponAdd: (coupon: Coupon) => void) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleAddCoupon = () => {
    if (validateCoupon(newCoupon)) {
      onCouponAdd(newCoupon);
      setNewCoupon({
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0,
      });
    }
  };

  const validateCoupon = (coupon: Coupon): boolean => {
    return coupon.name.length > 0 && coupon.code.length > 0 && coupon.discountValue > 0;
  };

  return {
    newCoupon,
    setNewCoupon,
    handleAddCoupon,
    validateCoupon,
  };
};
