import { useState } from 'react';
import { Coupon } from '../../types';
import { getInitialCoupon } from '../utils/couponUtils';

export const useCouponManagement = (onCouponAdd: (newCoupon: Coupon) => void) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(getInitialCoupon());

  const addCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(getInitialCoupon());
  };

  const updateCouponWith = (attributeName: keyof Coupon, attribute: unknown) => {
    setNewCoupon({ ...newCoupon, [attributeName]: attribute });
  };

  return {
    newCoupon,
    addCoupon,
    updateCouponWith,
  };
};
