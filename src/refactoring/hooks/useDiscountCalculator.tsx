import { useCallback } from "react";
import { CartItem, Coupon } from "../../types";

interface DiscountCalculation {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

export const useDiscountCalculator = () => {
  const calculateItemDiscount = useCallback((item: CartItem) => {
    const { price } = item.product;
    const { quantity } = item;
    const basePrice = price * quantity;

    const maxDiscountRate = item.product.discounts.reduce(
      (maxDiscount, discount) => {
        return quantity >= discount.quantity && discount.rate > maxDiscount
          ? discount.rate
          : maxDiscount;
      },
      0
    );

    const priceAfterDiscount = basePrice * (1 - maxDiscountRate);

    return {
      beforeDiscount: basePrice,
      afterDiscount: priceAfterDiscount,
    };
  }, []);

  const applyCouponDiscount = useCallback(
    (
      totalBeforeDiscount: number,
      totalAfterDiscount: number,
      coupon: Coupon | null
    ) => {
      if (!coupon) {
        return {
          finalAfterDiscount: totalAfterDiscount,
          totalDiscount: totalBeforeDiscount - totalAfterDiscount,
        };
      }

      let finalAfterDiscount = totalAfterDiscount;
      if (coupon.discountType === "amount") {
        finalAfterDiscount = Math.max(
          0,
          totalAfterDiscount - coupon.discountValue
        );
      } else {
        finalAfterDiscount *= 1 - coupon.discountValue / 100;
      }

      return {
        finalAfterDiscount,
        totalDiscount: totalBeforeDiscount - finalAfterDiscount,
      };
    },
    []
  );

  const calculateTotal = useCallback(
    (
      cart: Array<CartItem>,
      selectedCoupon: Coupon | null
    ): DiscountCalculation => {
      const { totalBeforeDiscount, totalAfterDiscount } = cart.reduce(
        (totals, item) => {
          const { beforeDiscount, afterDiscount } = calculateItemDiscount(item);
          return {
            totalBeforeDiscount: totals.totalBeforeDiscount + beforeDiscount,
            totalAfterDiscount: totals.totalAfterDiscount + afterDiscount,
          };
        },
        { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
      );

      const { finalAfterDiscount, totalDiscount } = applyCouponDiscount(
        totalBeforeDiscount,
        totalAfterDiscount,
        selectedCoupon
      );

      return {
        totalBeforeDiscount: Math.round(totalBeforeDiscount),
        totalAfterDiscount: Math.round(finalAfterDiscount),
        totalDiscount: Math.round(totalDiscount),
      };
    },
    [calculateItemDiscount, applyCouponDiscount]
  );

  return {
    calculateTotal,
    calculateItemDiscount,
    applyCouponDiscount,
  };
};
