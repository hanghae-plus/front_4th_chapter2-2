import { config } from "../config";
import { Coupon } from "../models";

interface CouponService {
  getCoupons(): Promise<Coupon[]>;
  addCoupon(coupon: Coupon): Promise<Coupon>;
  updateCoupon(code: string, coupon: Coupon): Promise<Coupon>;
  deleteCoupon(code: string): Promise<void>;
}

export const couponService: CouponService = {
  getCoupons: async () => {
    const response = await fetch(`${config.apiUrl}/coupons`);
    const { data } = await response.json();
    return data;
  },

  addCoupon: async (coupon) => {
    const response = await fetch(`${config.apiUrl}/coupons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coupon),
    });
    const { data } = await response.json();
    return data;
  },

  updateCoupon: async (code, coupon) => {
    const response = await fetch(`${config.apiUrl}/coupons/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coupon),
    });
    const { data } = await response.json();
    return data;
  },

  deleteCoupon: async (code) => {
    await fetch(`${config.apiUrl}/coupons/${code}`, {
      method: "DELETE",
    });
  },
};
