import { create } from 'zustand';
import { Coupon } from '../../../shared/types/types';

interface CouponStore {
  coupons: Coupon[];
  setCoupons: (products: Coupon[]) => void;
  selectedCoupon: Coupon | null;
  selectCoupon: (coupon: Coupon) => void;
  addCoupon: (newCoupon: Coupon) => void;
}

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

export const useCouponStore = create<CouponStore>((set) => ({
  coupons: initialCoupons,
  setCoupons: (coupons: Coupon[]) => set({ coupons }),
  selectedCoupon: null,
  selectCoupon: (coupon: Coupon) => set({ selectedCoupon: coupon }),
  addCoupon: (newCoupon: Coupon) =>
    set((state) => ({
      coupons: [...state.coupons, newCoupon],
    })),
}));
