import { CartItem, Coupon, Discount } from "../../types";

const calculateTotalPrice = (price: number, quantity: number) => {
  return price * quantity;
}

const getMaxDiscount = (quantity: number, discounts: Discount[]) => {
  return discounts.reduce((max, discount) => {
    return quantity >= discount.quantity && discount.rate > max ? discount.rate : max;
  }, 0);
}

export const calculateItemTotal = (item: CartItem) => {
  const { price, discounts } = item.product;
  const { quantity } = item;

  const totalBeforeDiscount = calculateTotalPrice(price, quantity);
  const discount = getMaxDiscount(quantity, discounts);

  return totalBeforeDiscount * (1 - discount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  
  return getMaxDiscount(quantity, discounts);
};

const applyCouponDiscount = (amount: number, coupon: Coupon | null) => {
  if (!coupon) return amount;
  return coupon.discountType === 'amount' 
    ? Math.max(0, amount - coupon.discountValue) 
    : amount * (1 - coupon.discountValue / 100);
}

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce((total, item) => {
    return total += calculateTotalPrice(item.product.price, item.quantity);
  }, 0);

  const totalAfterDiscount = cart.reduce((total, item) => {
    return total += calculateItemTotal(item);
  }, 0);

  const totalLastDiscount = applyCouponDiscount(totalAfterDiscount, selectedCoupon);
  const totalDiscount = totalBeforeDiscount - totalLastDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalLastDiscount),
    totalDiscount: Math.round(totalDiscount)
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  let cartItems = cart.map(item => {
    if (item.product.id === productId) {
      const maxQuantity = item.product.stock;
      const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
      return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
    }
    return item;
  }).filter((item): item is CartItem => item !== null)
  return cartItems;
};
