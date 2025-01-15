import { API, LOCAL_KEYS } from "../../const.ts";
import { Coupon } from "../../types.ts";
import { useStateByMode } from "./useStateByMode.ts";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useStateByMode<Coupon[]>(
    LOCAL_KEYS.COUPON,
    API.COUPON,
    initialCoupons,
  );

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return { coupons, addCoupon };
};
