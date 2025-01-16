import { CartItem } from "../../types";
import { getMaxApplicableDiscount } from "../models/cart";

export const useDiscountCalculator = () => {
	const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

	const getAppliedDiscount = (item: CartItem) => getMaxApplicableDiscount(item);

	return {
		getMaxDiscount,
    getAppliedDiscount
  };
}