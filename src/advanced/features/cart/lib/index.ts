import { Coupon } from '@advanced/entities/coupon';
import { Product } from '@advanced/entities/product';
import { CartItem } from '../model';

export const calculateItemTotal = (item: CartItem) => {
  return (
    item.product.price * item.quantity * (1 - getMaxApplicableDiscount(item))
  );
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { quantity } = item;

  return item.product.discounts.reduce(
    (maxDiscount, discount) =>
      quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount,
    0,
  );
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
) => {
  const totalBeforeDiscount = cart.reduce(
    (totalCost, item) => totalCost + item.product.price * item.quantity,
    0,
  );

  let totalAfterDiscount = cart.reduce(
    (totalCost, item) => totalCost + calculateItemTotal(item),
    0,
  );

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue,
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === productId);

  if (!existingItem) return cart;

  const maxQuantity = existingItem.product.stock;
  const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));

  if (updatedQuantity > 0) {
    return cart.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: updatedQuantity }
        : item,
    );
  }
  return cart.filter((item) => item.product.id !== productId);
};

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
