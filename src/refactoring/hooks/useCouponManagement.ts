import { useState } from 'react';
import { Coupon } from '../../types';
import { getInitialCoupon } from '../models/coupon';
import { updateKey } from '../utils';

export const useCouponManagement = (onCouponAdd: (newCoupon: Coupon) => void) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(getInitialCoupon());

  const addCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(getInitialCoupon());
  };

  const updateCouponWith = (attributeName: keyof Coupon, attribute: Coupon[keyof Coupon]) => {
    const updatedCoupon = updateKey(newCoupon, attributeName, attribute);
    setNewCoupon(updatedCoupon);
  };

  return {
    newCoupon,
    addCoupon,
    updateCouponWith,
  };
};
