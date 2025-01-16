import { useEffect, useState } from 'react';
import { Coupon } from '../../types.ts';
import { useLocalStorage } from './useLocalStorage.ts';
import { usePreservedCallback } from './usePreservedCallback.ts';

export const useCoupons = (initialCoupons: Coupon[] = []) => {
  const { getItem, setItem } = useLocalStorage();

  const [coupons, setCoupons] = useState<Coupon[]>(getItem('coupon') || initialCoupons);

  useEffect(() => {
    setItem('coupons', coupons);
  }, [coupons]);

  const addCoupon = usePreservedCallback((coupon: Coupon) => {
    setCoupons((prev) => {
      const exist = prev.some((current) => current.code === coupon.code);
      return exist ? prev : [...prev, coupon];
    });
  });

  return {
    coupons,
    addCoupon,
  };
};
