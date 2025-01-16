import { Coupon } from '@/shared/types';

import { create } from 'zustand';

interface CouponState {
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  handleCouponAdd: (newCoupon: Coupon) => void;
}

export const useCouponStore = create<CouponState>((set) => ({
  coupons: [],

  setCoupons: (coupons: Coupon[]) => {
    set({ coupons });
  },

  handleCouponAdd: (newCoupon: Coupon) => {
    set((state) => ({
      coupons: [...state.coupons, newCoupon],
    }));
  },
}));
