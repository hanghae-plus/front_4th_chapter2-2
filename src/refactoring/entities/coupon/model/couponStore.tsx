import { Coupon } from '@/shared/types';

import { create } from 'zustand';
import { addItem } from '@/shared/libs';

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
      coupons: addItem(state.coupons, newCoupon),
    }));
  },
}));
