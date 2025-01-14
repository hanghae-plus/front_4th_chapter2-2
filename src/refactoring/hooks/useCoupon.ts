import {Coupon} from "../../types.ts";
import {useState} from "react";

export const useCoupons = (initialCoupons: Coupon[]) => {
    const [coupons, setCoupons] = useState(initialCoupons);

    const _calculateNewCoupon = (coupon: Coupon) => {
        return [...coupons, coupon];
    }

    const addCoupon = (coupon: Coupon) => {
        setCoupons(_calculateNewCoupon(coupon))
    }

    return {coupons: coupons, addCoupon: addCoupon,};
};
