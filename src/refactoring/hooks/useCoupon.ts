import { Coupon } from "../../types.ts";
import { useStateByMode } from "./useStateByMode.ts";
import { LOCAL_KEYS } from "../utils/localStorageUtil.ts";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useStateByMode<Coupon[]>(
    LOCAL_KEYS.COUPON_KEY,
    initialCoupons,
  );

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return { coupons, addCoupon };
};
