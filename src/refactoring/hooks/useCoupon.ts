import useCouponStore from "../store/useCouponStore";

export const useCoupons = () => {
  const {
    coupons,
    newCoupon,
    addCoupon,
    handleNewCoupon,
    updateCoupon,
    initialCoupons,
  } = useCouponStore();

  return {
    coupons,
    newCoupon,
    addCoupon,
    handleNewCoupon,
    updateCoupon,
    initialCoupons,
  };
};
