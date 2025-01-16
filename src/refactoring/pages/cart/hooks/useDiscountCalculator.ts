import { useMemo } from "react";
import { CartItem, Coupon } from "../../../../types";

export const useDiscountCalculator = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const result = useMemo(() => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const { price } = item.product;
      const { quantity } = item;
      totalBeforeDiscount += price * quantity;

      const discount = item.product.discounts.reduce((maxDiscount, d) => {
        return quantity >= d.quantity && d.rate > maxDiscount
          ? d.rate
          : maxDiscount;
      }, 0);

      totalAfterDiscount += price * quantity * (1 - discount);
    });

    let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

    // 쿠폰 적용
    if (selectedCoupon) {
      if (selectedCoupon.discountType === "amount") {
        totalAfterDiscount = Math.max(
          0,
          totalAfterDiscount - selectedCoupon.discountValue
        );
      } else {
        totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
      }
      totalDiscount = totalBeforeDiscount - totalAfterDiscount;
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalDiscount),
    };
  }, [cart, selectedCoupon]);

  return result;
};
