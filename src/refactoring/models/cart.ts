import { CartItem, Coupon, Discount } from "../../types";
import { useDiscountCalculator } from "../hooks/useDiscountCalculator";

const calculateMaxDiscount = (discounts: Discount[], quantity: number) => {
  return discounts.reduce((max, discount) => {
    return quantity >= discount.quantity ? Math.max(max, discount.rate) : max;
  }, 0);
};

const calculateItemTotalPrice = (
  price: number,
  quantity: number,
  discountRate: number
) => {
  return price * quantity * (1 - discountRate);
};

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discountRate = calculateMaxDiscount(product.discounts, quantity);
  return calculateItemTotalPrice(product.price, quantity, discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  return calculateMaxDiscount(product.discounts, quantity);
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const calculateTotals = useDiscountCalculator(cart, selectedCoupon);
  return calculateTotals();
};

export const validateQuantity = (
  newQuantity: number,
  maxStock: number
): number => {
  return Math.max(0, Math.min(newQuantity, maxStock));
};

export const updateItemQuantity = (
  item: CartItem,
  productId: string,
  newQuantity: number
): CartItem | null => {
  if (item.product.id !== productId) {
    return item;
  }

  const validatedQuantity = validateQuantity(newQuantity, item.product.stock);
  return validatedQuantity > 0
    ? { ...item, quantity: validatedQuantity }
    : null;
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => updateItemQuantity(item, productId, newQuantity))
    .filter((item): item is CartItem => item !== null);
};
