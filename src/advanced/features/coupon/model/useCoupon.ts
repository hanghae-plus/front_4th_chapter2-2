import { useState } from 'react';
import { Coupon } from '@advanced/entities/coupon';
import { useAddCouponMutation } from './useAddCouponMutation';

export const useCoupon = () => {
  const { mutate: addCouponMutate } = useAddCouponMutation();
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const changeCoupon = (newCoupon: Partial<Coupon>) => {
    setNewCoupon((prev) => ({ ...prev, ...newCoupon }));
  };

  const addCoupon = (newCoupon: Coupon) => {
    addCouponMutate(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  return {
    newCoupon,
    changeCoupon,
    addCoupon,
  };
};
