import { CartItem } from "../../types.ts";

export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]): number => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
}

export const getAppliedDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;
    const appliedDiscount = 0;

    // reduce 개선
    return discounts.reduce((maxDiscount, discount) => {
        return quantity >= discount.quantity ? Math.max(maxDiscount, discount.rate) : maxDiscount;
    }, appliedDiscount);
};