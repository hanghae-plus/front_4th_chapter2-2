import { Coupon } from '../../types.ts';
import { useState } from 'react';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  //
  const updateNewCoupon = (updatedFields: Partial<Coupon>) => {
    setNewCoupon((prevCoupon) => ({ ...prevCoupon, ...updatedFields }));
  };

  return { coupons, addCoupon, newCoupon, updateNewCoupon };
};

export const setCoupon = () => {};
