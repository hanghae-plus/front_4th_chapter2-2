import { useState } from 'react';
import { Coupon } from '../../types';
import { initialCoupons } from '../models/initialData';

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return { coupons, addCoupon };
};
